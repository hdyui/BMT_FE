import fs from 'node:fs';
import { setTimeout as pause } from 'node:timers/promises';
process.env.AUDIT_IMPORT_ONLY = '1';
const { loader, unwrap, same } = await import('./run-full-api-audit.mjs');
const origin = 'http://localhost:3001';
const backend = 'https://bmt-deploy-latest.onrender.com/api/v1';
const saveOnly = process.env.AUDIT_SAVE_ONLY === '1';
const report = saveOnly ? JSON.parse(fs.readFileSync('docs/ADMIN_ROUNDTRIP_RESULTS_2026-10-02.json', 'utf8')) : { startedAt: new Date().toISOString(), saves: [], details: [], rechecks: [], auth: {}, nodeComparisons: [], issues: [] };
if (saveOnly) { report.saves = []; report.nodeComparisons = []; report.preservationVerifiedAt = new Date().toISOString(); }
let cookie = '';
async function call(url, method = 'GET', body, session = cookie) {
  await pause(700);
  const response = await fetch(url, { method, headers: { ...(session ? { Cookie: session } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(45000) });
  const text = await response.text();
  let raw;
  try { raw = JSON.parse(text); } catch { raw = text; }
  let value;
  try { value = unwrap(raw); } catch { value = null; }
  return { status: response.status, value, raw, response };
}
const query = options => {
  const value = new URLSearchParams(options?.query || {}).toString();
  return value ? '?' + value : '';
};
const api = Object.fromEntries(['get', 'post', 'patch', 'delete'].map(method => [method, async (endpoint, bodyOrOptions, options) => {
  const res = await call(backend + endpoint + query(method === 'get' ? bodyOrOptions : options), method.toUpperCase(), method === 'get' ? undefined : bodyOrOptions);
  if (res.status >= 400 || res.raw?.isSuccess === false) throw new Error(`${method} ${endpoint}: HTTP ${res.status}`);
  return res.value;
}]));
function leaves(value) {
  if (Array.isArray(value)) return value.flatMap(leaves);
  if (value && typeof value === 'object') return Object.values(value).flatMap(leaves);
  return [value];
}
const catalog = key => origin + '/api/admin/catalog?resourceKey=' + encodeURIComponent(key);
function differences(a, b, prefix = '') {
  if (same(a, b)) return [];
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return [prefix];
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key => differences(a[key] ?? null, b[key] ?? null, prefix ? prefix + '.' + key : key));
}
function preservation(before, after) {
  const paths = differences(before, after);
  return { rawResponseUnchanged: paths.length === 0, contentPreserved: paths.every(key => /(^|\.)(updatedAt|modifiedAt|lastModifiedAt)$/.test(key)), changedPaths: paths };
}
try {
  const login = await call(origin + '/api/v1/auth/login', 'POST', { email: process.env.AUDIT_ADMIN_EMAIL, password: process.env.AUDIT_ADMIN_PASSWORD }, '');
  if (login.status !== 200) throw new Error('Login failed: ' + login.status);
  cookie = login.response.headers.getSetCookie().map(item => item.split(';')[0]).join('; ');
  const load = loader({ '@/shared/lib/api/client': { api }, '@/features/admin/services/revalidate-public-content': { revalidatePublicContent: async () => {} } });
  if (!saveOnly) {
  const swagger = await call('https://bmt-deploy-latest.onrender.com/swagger/v1/swagger.json', 'GET', undefined, '');
  report.backendDeleteContracts = Object.entries(swagger.value?.paths || {}).filter(([key, value]) => value.delete && /projects|form-submissions|news|jobs/.test(key)).map(([key, value]) => ({ path: key, summary: value.delete.summary, description: value.delete.description }));
  const prior = JSON.parse(fs.readFileSync('docs/FULL_API_AUDIT_RESULTS_2026-10-02.json', 'utf8'));
  for (const route of prior.routes.filter(item => item.status !== 200)) {
    const res = await call(origin + route.route, 'GET', undefined, '');
    report.rechecks.push({ route: route.route, status: res.status });
  }
  for (const failed of prior.requests.filter(item => !item.success && item.url.startsWith(origin))) {
    const res = await call(failed.url);
    report.rechecks.push({ route: failed.url, status: res.status });
  }
  for (const group of ['news', 'jobs']) {
    const list = await api.get('/admin/' + group);
    for (const item of list.items || list) {
      const key = group === 'news' ? 'news/list' : 'recruitment/jobs';
      const [admin, normalized] = [await api.get('/admin/' + group + '/' + item.id), await call(catalog(key) + '&id=' + item.id)];
      const norm = normalized.value;
      report.details.push({ group, id: item.id, status: normalized.status, sourceBodyLength: typeof admin.body === 'string' ? admin.body.length : undefined, normalizedBodyLength: typeof norm?.body === 'string' ? norm.body.length : undefined, fields: Object.keys(admin), emptyNormalizedFields: Object.keys(norm || {}).filter(field => norm[field] === '') });
    }
  }
  }
  // Send existing values through each distinct fixed-page save mechanism.
  // No marker is written into real website content.
  const saves = [
    ['home/hero', '/admin/pages/home'], ['about/hero', '/admin/pages/about'],
    ['projects/page-hero', '/admin/pages/projects'], ['news/page-hero', '/admin/pages/news'],
    ['recruitment/hero', '/admin/pages/recruitment'], ['contacts/hero', '/admin/pages/contact'],
    ['settings/branding', '/admin/site-settings'],
  ];
  for (const [key, endpoint] of saves) {
    const before = await api.get(endpoint);
    const records = (await call(catalog(key))).value;
    const record = records[0];
    const saved = await call(origin + '/api/admin/catalog', 'PATCH', { resourceKey: key, id: record.id, input: record });
    const after = await api.get(endpoint);
    report.saves.push({ key, status: saved.status, ...preservation(before, after), savedIdMatches: saved.value?.id === record.id });
  }
  const { getRemoteBinding } = load('features/admin/services/remote-bindings.ts');
  const { SERVICE_PAGES } = load('features/services/api/spec.ts');
  for (const page of SERVICE_PAGES) {
    const section = page.sections[0], key = section.resourceKey;
    const binding = getRemoteBinding(key), records = (await binding.load())[key];
    const before = await api.get('/admin/pages/' + page.pageCode);
    const previous = structuredClone(records);
    const field = section.fields[0];
    previous[0][field] = '__audit_previous_only_not_sent__';
    await binding.save(key, previous, records);
    const after = await api.get('/admin/pages/' + page.pageCode);
    const publicPage = await api.get('/pages/' + page.pageCode);
    const publicLeaves = leaves(publicPage);
    report.saves.push({ key, status: 200, ...preservation(before, after) });
    const sections = new Map((after.nodes[0]?.children || []).map(node => [node.nodeKey, node]));
    const fields = page.sections.flatMap(spec => {
      const node = sections.get(spec.section);
      const nodes = spec.kind === 'single' ? [node] : (node?.children || []).slice(0, spec.slots);
      return nodes.flatMap(node => spec.fields.map(field => ({ section: spec.section, field, value: node?.value?.[field] })));
    });
    report.nodeComparisons.push({ page: page.pageCode, fieldsChecked: fields.length, absentValues: fields.filter(item => item.value !== '' && item.value != null && !leaves(item.value).every(value => publicLeaves.includes(value))).map(item => ({ section: item.section, field: item.field })) });
  }
  for (const [key, field, endpoint] of [
    ['quotation/hero', 'title', '/admin/pages/quotation'],
    ['settings/capability-profile', 'title', '/admin/pages/capability-profile'],
  ]) {
    const binding = getRemoteBinding(key), records = (await binding.load())[key];
    const before = await api.get(endpoint);
    const previous = structuredClone(records);
    previous[0][field] = '__audit_previous_only_not_sent__';
    await binding.save(key, previous, records);
    const after = await api.get(endpoint);
    report.saves.push({ key, status: 200, ...preservation(before, after) });
  }
  // Demonstrate the stale category ID using the explicitly created sample only.
  if (!saveOnly) {
  const category = await api.get('/project-categories');
  const id = '7f0c8abc-9df8-4348-9012-9e85a49d1d8c';
  const sampleURL = catalog('projects/list') + '&id=' + id;
  const original = (await call(sampleURL)).value;
  const office = category.find(item => item.name === 'Văn phòng');
  try {
    const saved = await call(origin + '/api/admin/catalog', 'PATCH', { resourceKey: 'projects/list', id, input: { ...original, category: office.name } });
    const observed = (await call(sampleURL)).value;
    report.categoryChange = { status: saved.status, expected: office.id, actual: observed.categoryId, userSelectedNewName: office.name, actualName: observed.category, reproducedStaleId: observed.categoryId === original.categoryId };
  } finally {
    const restored = await call(origin + '/api/admin/catalog', 'PATCH', { resourceKey: 'projects/list', id, input: original });
    report.sampleRestored = restored.status === 200 && same(original, (await call(sampleURL)).value);
  }
  const refreshOnly = cookie.split('; ').filter(item => item.startsWith('refreshToken=')).join('; ');
  const denied = await call(catalog('projects/list'), 'GET', undefined, refreshOnly);
  report.auth.refreshOnlyCatalogStatus = denied.status;
  report.auth.refreshOnlyError = denied.raw?.message;
  const refreshed = await call(origin + '/api/v1/auth/refresh', 'POST', undefined, refreshOnly);
  report.auth.explicitRefreshStatus = refreshed.status;
  if (refreshed.status === 200) {
    cookie = refreshed.response.headers.getSetCookie().map(item => item.split(';')[0]).join('; ');
    report.auth.catalogAfterRefreshStatus = (await call(catalog('projects/list'))).status;
  }
  }
} catch (error) {
  report.issues.push(error.message);
  process.exitCode = 1;
} finally {
  if (cookie) await call(origin + '/api/v1/auth/logout', 'POST').catch(() => {});
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync('docs/ADMIN_ROUNDTRIP_RESULTS_2026-10-02.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ saves: report.saves, detailCount: report.details.length, rechecksFailed: report.rechecks.filter(item => item.status !== 200), auth: report.auth, nodeComparisons: report.nodeComparisons, categoryChange: report.categoryChange, sampleRestored: report.sampleRestored, issues: report.issues }, null, 2));
}
