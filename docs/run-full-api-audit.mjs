import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { setTimeout as pause } from 'node:timers/promises';

// Credentials are supplied only through the process environment and never written.
const requireNode = createRequire(import.meta.url);
const origin = process.env.AUDIT_FE_ORIGIN || 'http://localhost:3001';
const backend = 'https://bmt-deploy-latest.onrender.com/api/v1';
const result = { startedAt: new Date().toISOString(), origin, resources: [], requests: [], comparisons: [], routes: [], estimates: [], issues: [] };
let cookie = '';
const bodies = new Map();
let nextRequestAt = 0;
const unwrap = body => {
  let current = body;
  while (current && typeof current === 'object' && 'value' in current) {
    if (current.isSuccess === false || current.isFailed === true) throw new Error('Failed response envelope');
    current = current.value;
  }
  return current;
};
const summary = value => ({ shape: Array.isArray(value) ? 'array' : typeof value, count: Array.isArray(value) ? value.length : value?.items?.length, totalCount: value?.totalCount });
async function request(url, { auth = false, method = 'GET', body, record = true, redirect = 'follow' } = {}) {
  const sendAt = Math.max(Date.now(), nextRequestAt);
  nextRequestAt = sendAt + 800;
  await pause(sendAt - Date.now());
  const started = Date.now();
  const response = await fetch(url, { method, redirect, headers: { ...(auth ? { Cookie: cookie } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(45000) });
  const raw = await response.text();
  let parsed;
  try { parsed = JSON.parse(raw); } catch { parsed = raw; }
  let value;
  try { value = unwrap(parsed); } catch { value = null; }
  if (record) result.requests.push({ url, method, status: response.status, durationMs: Date.now() - started, success: response.ok && parsed?.isSuccess !== false, ...summary(value) });
  if (method === 'GET') bodies.set(url, value);
  return { response, value, parsed, raw };
}
async function mapLimit(items, fn, limit = 4) {
  let index = 0;
  return Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const item = items[index++];
      try { await fn(item); } catch (error) { result.issues.push({ item, error: error.message }); }
    }
  }));
}
function loader(mocks = {}, globals = {}) {
  const modules = new Map();
  function load(file) {
    let resolved = path.resolve(file);
    if (!fs.existsSync(resolved)) resolved += '.ts';
    if (modules.has(resolved)) return modules.get(resolved);
    const exports = {};
    modules.set(resolved, exports);
    const output = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    vm.runInNewContext(output, { exports, console, Response, Request, Headers, URL, URLSearchParams, AbortSignal, Blob, FormData, Buffer, setTimeout, clearTimeout, structuredClone, process,
      require(id) {
        if (Object.hasOwn(mocks, id)) return mocks[id];
        if (id === 'server-only') return {};
        if (id.startsWith('@/')) return load(id.slice(2));
        if (id.startsWith('.')) return load(path.resolve(path.dirname(resolved), id));
        return requireNode(id);
      }, ...globals }, { filename: resolved });
    return exports;
  }
  return load;
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
const hash = value => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const same = (a, b) => hash(a) === hash(b);
const api = Object.fromEntries(['get', 'post', 'patch', 'delete'].map(method => [method, async (endpoint, bodyOrOptions, options) => {
  const opts = method === 'get' ? bodyOrOptions : options;
  const query = new URLSearchParams(opts?.query || {}).toString();
  const res = await request(backend + endpoint + (query ? '?' + query : ''), { auth: true, method: method.toUpperCase(), body: method === 'get' ? undefined : bodyOrOptions });
  if (!res.response.ok || res.parsed?.isSuccess === false) throw new Error(`${endpoint}: HTTP ${res.response.status}`);
  return res.value;
}]));

export { loader, unwrap, same };

if (process.env.AUDIT_IMPORT_ONLY !== '1') try {
  const login = await request(origin + '/api/v1/auth/login', { method: 'POST', body: { email: process.env.AUDIT_ADMIN_EMAIL, password: process.env.AUDIT_ADMIN_PASSWORD }, record: false });
  if (!login.response.ok) throw new Error(`Login HTTP ${login.response.status}`);
  cookie = login.response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  if (!cookie) throw new Error('Login did not return session cookies');
  console.log('Admin login passed');
  const load = loader({ '@/shared/lib/api/client': { api }, '@/features/admin/services/revalidate-public-content': { revalidatePublicContent: async () => {} }, 'next/headers': {}, 'next/cache': {}, '@/shared/lib/api/server': {} });
  const { adminResourceRegistry } = load('features/admin/lib/mock-data/resource-registry.ts');
  const { ADMIN_API_RESOURCE_KEYS } = load('features/admin/services/catalog-api.server.ts');
  const { getRemoteBinding } = load('features/admin/services/remote-bindings.ts');
  const catalog = new Set(ADMIN_API_RESOURCE_KEYS);
  const bindings = new Map();
  for (const [key, config] of Object.entries(adminResourceRegistry)) {
    const binding = getRemoteBinding(key);
    const resource = { key, route: `/admin/${config.module}/${config.path}`, source: catalog.has(key) ? 'catalog-api' : binding ? 'remote-binding' : 'mock' };
    result.resources.push(resource);
    if (binding) bindings.set(binding.pageKey, binding);
  }
  await mapLimit([...catalog], async key => {
    const res = await request(origin + '/api/admin/catalog?resourceKey=' + encodeURIComponent(key), { auth: true });
    const resource = result.resources.find(item => item.key === key);
    resource.status = res.response.status;
    resource.count = res.value?.length;
    resource.emptyFields = Array.isArray(res.value) ? res.value.flatMap((record, index) => Object.keys(record).filter(field => record[field] === '').map(field => `${index}:${field}`)) : [];
    if (!res.response.ok) result.issues.push({ item: key, error: `HTTP ${res.response.status}` });
  });
  await mapLimit([...bindings.values()], async binding => {
    const loaded = await binding.load();
    for (const [key, records] of Object.entries(loaded)) {
      const item = result.resources.find(item => item.key === key);
      if (item) { item.status = 200; item.count = records.length; item.emptyFields = records.flatMap((record, index) => Object.keys(record).filter(field => record[field] === '').map(field => `${index}:${field}`)); }
    }
  });
  console.log('Resource reads:', result.resources.length, 'mock:', result.resources.filter(item => item.source === 'mock').map(item => item.key).join(', '));
  const pages = ['home', 'about', 'projects', 'news', 'recruitment', 'contact', 'services', 'serviceTurnkey', 'serviceArchitectureInterior', 'serviceConstruction', 'serviceRenovation', 'quotation', 'capability-profile'];
  const endpoints = ['/auth/me', '/admin/projects?PageIndex=1&PageSize=500', '/projects', '/project-categories', '/admin/project-categories', '/admin/news', '/news', '/news?Featured=true', '/news?HighlightHome=true', '/admin/jobs', '/jobs', '/admin/site-settings', '/site-settings', '/pages/home/full-content', '/admin/price-ranges', '/admin/capability-profile/pages?pageIndex=1&pageSize=100', '/capability-profile/pages', '/admin/form-submissions?PageIndex=1&PageSize=100', ...pages.flatMap(code => ['/admin/pages/' + code, '/pages/' + code])];
  await mapLimit(endpoints, async endpoint => {
    await request(backend + endpoint, { auth: endpoint.startsWith('/admin/') || endpoint.startsWith('/auth/') });
  });
  for (const code of pages) {
    const admin = bodies.get(backend + '/admin/pages/' + code), pub = bodies.get(backend + '/pages/' + code);
    const content = admin?.content || admin;
    const publicContent = pub?.content || pub;
    // Node-based pages have a different public representation; compare leaf values below.
    result.comparisons.push({ item: 'page:' + code, sameContent: same(content, publicContent), adminKeys: Object.keys(content || {}), publicKeys: Object.keys(publicContent || {}) });
  }
  const adminProjects = bodies.get(backend + '/admin/projects?PageIndex=1&PageSize=500')?.items || [];
  const publicProjectsValue = bodies.get(backend + '/projects');
  const publicProjects = Array.isArray(publicProjectsValue) ? publicProjectsValue : publicProjectsValue?.items || [];
  result.projectCounts = { admin: adminProjects.length, public: publicProjects.length, excluded: adminProjects.filter(project => !publicProjects.some(pub => pub.id === project.id)).map(project => ({ id: project.id, slug: project.slug })) };
  await mapLimit(adminProjects, async project => {
    const [adm, pub, normalized] = await Promise.all([
      request(backend + '/admin/projects/' + project.id, { auth: true }),
      request(backend + '/projects/' + project.slug),
      request(origin + '/api/admin/catalog?resourceKey=projects%2Fdetails&id=' + project.id, { auth: true }),
    ]);
    result.comparisons.push({ item: 'project:' + project.slug, sameContent: pub.response.ok ? same(adm.value, pub.value) : null, publicStatus: pub.response.status, normalizedStatus: normalized.response.status });
  });
  const categories = bodies.get(backend + '/project-categories') || [];
  result.categoryCounts = [];
  await mapLimit(categories, async category => {
    const res = await request(backend + '/projects?categoryId=' + category.id);
    result.categoryCounts.push({ name: category.name, count: res.value?.length });
  });
  const { BUILDING_TYPE_CODES, SERVICE_TYPE_CODES } = load('features/quotation/services/estimate-codes.ts');
  await mapLimit(BUILDING_TYPE_CODES.flatMap(buildingType => SERVICE_TYPE_CODES.map(serviceType => ({ buildingType, serviceType }))), async codes => {
    const range = bodies.get(backend + '/admin/price-ranges').find(item => item.buildingType === codes.buildingType && item.serviceType === codes.serviceType);
    const res = await request(origin + '/api/v1/quotation/estimate', { method: 'POST', body: { ...codes, areaM2: 100, budget: 1_000_000_000 } });
    result.estimates.push({ ...codes, status: res.response.status, matchesRange: res.value?.unitPriceMin === range?.unitPriceMin && res.value?.unitPriceMax === range?.unitPriceMax, correctTotals: res.value?.estimateMin === range?.unitPriceMin * 100 && res.value?.estimateMax === range?.unitPriceMax * 100 });
  });
  const publicRoutes = ['/', '/about', '/projects', '/services', '/services/turnkey', '/services/design', '/services/construction', '/services/renovation', '/quotation', '/capability-profile', '/news', '/careers', '/contact', ...publicProjects.map(project => '/projects/' + project.slug)];
  await mapLimit(publicRoutes, async route => {
    const res = await request(origin + route, { record: false });
    result.routes.push({ route, status: res.response.status, fallbackNotice: /Nội dung.*đang.*cập nhật|Đang cập nhật|chưa.*khởi tạo/i.test(res.raw), htmlBytes: res.raw.length });
  }, 2);
  const unauthorized = await request(origin + '/api/admin/catalog?resourceKey=projects%2Flist', { record: false });
  const adminRedirect = await request(origin + '/admin/projects', { redirect: 'manual', record: false });
  result.auth = { login: 200, unauthenticatedCatalog: unauthorized.response.status, unauthenticatedAdmin: adminRedirect.response.status, redirectsToLogin: adminRedirect.response.headers.get('location')?.includes('/admin/login') };
} catch (error) {
  result.issues.push({ item: 'audit', error: error.message });
  process.exitCode = 1;
} finally {
  if (cookie) await request(origin + '/api/v1/auth/logout', { auth: true, method: 'POST', record: false }).catch(() => {});
  result.finishedAt = new Date().toISOString();
  fs.writeFileSync('docs/FULL_API_AUDIT_RESULTS_2026-10-02.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ resources: result.resources.length, connected: result.resources.filter(item => item.source !== 'mock').length, resourcesFailed: result.resources.filter(item => item.source !== 'mock' && item.status !== 200), requestCount: result.requests.length, failedRequests: result.requests.filter(item => !item.success).map(item => ({ url: item.url, status: item.status })), projectCounts: result.projectCounts, categories: result.categoryCounts, estimates: result.estimates, routeFailures: result.routes.filter(item => item.status !== 200), auth: result.auth, issues: result.issues }, null, 2));
}
