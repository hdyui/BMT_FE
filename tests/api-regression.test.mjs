import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
const nodeRequire = createRequire(import.meta.url);

// Load the real TypeScript modules with isolated network/framework boundaries.
function loader(mocks = {}, globals = {}) {
  const modules = new Map();
  return function load(file, extra = "") {
    const resolved = path.resolve(file);
    if (modules.has(resolved)) return modules.get(resolved);
    const exports = {};
    modules.set(resolved, exports);
    const source = fs.readFileSync(resolved, "utf8") + extra;
    const output = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(output, {
      exports, console, Response, Request, Headers, AbortSignal, URL, Blob, FormData,
      Buffer, setTimeout, clearTimeout, structuredClone,
      process: { env: { API_CLIENT: "https://backend.example/api/v1" } },
      fetch: () => { throw new Error("Unexpected network request in regression test"); },
      ...globals,
      require(id) {
        if (Object.hasOwn(mocks, id)) return mocks[id];
        if (id === "server-only") return {};
        if (id.startsWith("@/") || id.startsWith(".")) {
          const target = id.startsWith("@/") ? id.slice(2) : path.resolve(path.dirname(resolved), id);
          return load(target.endsWith(".ts") ? target : target + ".ts");
        }
        return nodeRequire(id);
      },
    }, { filename: resolved });
    return exports;
  };
}

test("the registered Contact map editor exposes its URL field", () => {
  const load = loader();
  const { getAdminResource } = load("features/admin/lib/mock-data/resource-registry.ts");
  const { getEditableAdminSections } = load("features/admin/lib/editor-field-visibility.ts");
  const fields = getEditableAdminSections(getAdminResource("contacts/map").sections).flatMap(s => s.fields);
  const url = fields.find(f => f.key === "googleMapsUrl");
  assert.ok(url);
  assert.equal(url.type, "url");
  assert.equal(url.required, true);
});

test("public fetch caches anonymously by tag and rejects failed envelopes", async () => {
  let failed = false;
  let options;
  const load = loader({ react: { cache: fn => fn } }, {
    fetch: async (_url, init) => {
      options = init;
      return Response.json(failed ? { isSuccess: false } : { isSuccess: true, value: { title: "Contact" } });
    },
  });
  const { getPublicApiValue } = load("shared/lib/api/server.ts");
  assert.equal((await getPublicApiValue("/pages/contact")).title, "Contact");
  assert.equal(options.cache, "force-cache");
  assert.equal(options.next.revalidate, 60);
  assert.equal(options.next.tags[0], "bmt:contact");
  assert.equal(options.headers.Cookie, undefined);
  failed = true;
  await assert.rejects(getPublicApiValue("/pages/contact"));
});

function adminLoader(fetch, tags = []) {
  return loader({
    "next/headers": {
      cookies: async () => ({
        get: name =>
          name === "accessToken"
            ? { value: "access-session" }
            : name === "refreshToken"
              ? { value: "refresh-session" }
              : undefined,
      }),
    },
    "next/cache": { revalidateTag: (tag, profile) => tags.push({ tag, profile }) },
    "@/shared/lib/api/server": { getApiBaseUrl: () => "https://backend.example/api/v1" },
    "@/features/admin/lib/auth-config": {
      ADMIN_ACCESS_COOKIE: "accessToken",
      ADMIN_REFRESH_COOKIE: "refreshToken",
    },
  }, { fetch })("features/admin/services/catalog-api.server.ts", "\nexport { backendRequest, backendLogin };\n");
}

test("parallel admin GETs share the backend request and forward the real session", async () => {
  let reads = 0;
  const api = adminLoader(async (url, init) => {
    reads++;
    assert.equal(init.cache, "no-store");
    assert.equal(init.headers.get("Cookie"), "accessToken=access-session; refreshToken=refresh-session");
    await new Promise(resolve => setTimeout(resolve, 5));
    return Response.json({ value: { content: { map: { title: "Map", googleMapsUrl: "https://maps.example/" } } } });
  });
  const [a, b] = await Promise.all([api.loadAdminApiResource("contacts/map"), api.loadAdminApiResource("contacts/map")]);
  assert.equal(a[0].googleMapsUrl, b[0].googleMapsUrl);
  assert.equal(reads, 1);
  await api.loadAdminApiResource("contacts/map");
  assert.equal(reads, 2);
});

test("an unauthorized backend response retries once with the forwarded cookie", async () => {
  let reads = 0;
  const api = adminLoader(async (_url, init) => {
    reads++;
    assert.equal(init.headers.get("Cookie"), reads === 1 ? "session=expired" : "accessToken=access-session; refreshToken=refresh-session");
    return reads === 1 ? new Response("", { status: 401 }) : Response.json({ value: [] });
  });
  const result = await api.backendRequest("/admin/projects", {}, "session=expired");
  assert.equal(result.response.status, 200);
  assert.equal(reads, 2);
});

test("map save matches BE contract, reloads saved data and expires the public tag", async () => {
  const tags = [], writes = [];
  const map = { title: "Office", googleMapsUrl: "https://www.google.com/maps?output=embed" };
  const api = adminLoader(async (url, init) => {
    if (init.method === "PATCH") {
      writes.push({ url, body: JSON.parse(init.body) });
      return Response.json({ isSuccess: true });
    }
    return Response.json({ value: { content: { map } } });
  }, tags);
  const saved = await api.mutateAdminApiResource({ resourceKey: "contacts/map", method: "PATCH", id: "contact-map", input: { id: "contact-map", ...map } });
  assert.equal(writes.length, 1);
  assert.equal(writes[0].url, "https://backend.example/api/v1/admin/pages/contact/map");
  assert.deepEqual(writes[0].body, map);
  assert.equal(saved.googleMapsUrl, map.googleMapsUrl);
  assert.equal(tags[0].tag, "bmt:contact");
  assert.equal(tags[0].profile.expire, 0);
});

test("application-level mutation failure is not reported as saved or invalidated", async () => {
  const tags = [];
  const api = adminLoader(async () => Response.json({ isSuccess: false }), tags);
  await assert.rejects(api.backendRequest("/admin/pages/about/hero", { method: "PATCH", body: "{}" }, "session=one"));
  assert.equal(tags.length, 0);
});

test("form proxy validates input and handles backend 204 without JSON errors", async () => {
  let count = 0;
  const load = loader({
    "next/server": { NextResponse: { json: Response.json } },
    "@/shared/lib/api/server": { getApiBaseUrl: () => "https://backend.example/api/v1" },
  }, { fetch: async () => { count++; return new Response(null, { status: 204 }); } });
  const { POST } = load("app/api/form-submissions/route.ts");
  const request = body => new Request("http://localhost/api/form-submissions", { method: "POST", body: JSON.stringify(body) });
  assert.equal((await POST(request({}))).status, 400);
  assert.equal(count, 0);
  assert.equal((await POST(request({ customerName: "Test", phone: "0123456789" }))).status, 204);
  assert.equal(count, 1);
});
