import fs from 'node:fs';
import { setTimeout as pause } from 'node:timers/promises';
process.env.AUDIT_IMPORT_ONLY = '1';
const { unwrap } = await import('./run-full-api-audit.mjs');
const origin = 'http://localhost:3001';
let cookie = '';
let createdId;
const marker = 'API AUDIT pagination ' + Date.now();
const report = { startedAt: new Date().toISOString(), routes: [], issues: [] };
async function call(route, method = 'GET', body) {
  await pause(300);
  const response = await fetch(origin + route, { method, headers: { ...(cookie ? { Cookie: cookie } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(45000) });
  const text = await response.text();
  let raw;
  try { raw = JSON.parse(text); } catch { raw = text; }
  return { response, raw, value: unwrap(raw) };
}
try {
  const login = await call('/api/v1/auth/login', 'POST', { email: process.env.AUDIT_ADMIN_EMAIL, password: process.env.AUDIT_ADMIN_PASSWORD });
  if (login.response.status !== 200) throw new Error('Login failed');
  cookie = login.response.headers.getSetCookie().map(item => item.split(';')[0]).join('; ');
  const ids = ['home', 'about', 'services', 'services-overview', 'turnkey', 'design', 'construction', 'renovation', 'projects', 'capability-profile', 'quotation', 'news', 'recruitment', 'contact'];
  const queue = [{ path: '/admin/dashboard', depth: 0 }, { path: '/admin/projects', depth: 0 }, { path: '/admin/news', depth: 0 }, { path: '/admin/recruitment', depth: 0 }, { path: '/admin/settings/branding', depth: 0 }, { path: '/admin/contact-submissions', depth: 0 }, ...ids.map(id => ({ path: '/admin/content/' + id, depth: 0 }))];
  const seen = new Set();
  while (queue.length && seen.size < 120) {
    const item = queue.shift();
    if (seen.has(item.path)) continue;
    seen.add(item.path);
    try {
      const res = await call(item.path);
      const title = typeof res.raw === 'string' ? res.raw.match(/<title>(.*?)<\/title>/)?.[1] : undefined;
      report.routes.push({ route: item.path, finalRoute: new URL(res.response.url).pathname, status: res.response.status, title });
      if (item.depth < 1 && typeof res.raw === 'string') {
        const links = [...res.raw.matchAll(/href="(\/admin\/[^"#?]+)"/g)].map(match => match[1]);
        for (const route of links) if (!seen.has(route) && !route.includes('/login')) queue.push({ path: route, depth: item.depth + 1 });
      }
    } catch (error) { report.issues.push({ route: item.path, error: error.message }); }
  }
  // Explicitly authorized temporary news record, to cross the current 20-item boundary.
  const before = (await call('/api/v1/admin/news?PageIndex=1&PageSize=500')).value;
  const template = before.items[0];
  const input = { title: marker, excerpt: marker, desktopImage: template.imageUrl, body: '<p>' + marker + '</p>', featured: false, highlightHome: false, __apiDetailLoaded: true };
  const created = await call('/api/admin/catalog', 'POST', { resourceKey: 'news/list', input });
  createdId = created.value?.id;
  if (!createdId) {
    const existing = (await call('/api/v1/admin/news?PageIndex=1&PageSize=500')).value;
    createdId = existing.items.find(item => item.title === marker)?.id;
  }
  if (!createdId) throw new Error('Pagination test record was not created');
  const real = (await call('/api/v1/admin/news?PageIndex=1&PageSize=500')).value;
  const frontend = (await call('/api/admin/catalog?resourceKey=news%2Flist')).value;
  report.newsPagination = { createdId, backendTotal: real.totalCount, backendFetched: real.items.length, frontendFetched: frontend.length, missingCount: real.items.length - frontend.length, omissionReproduced: real.items.length > frontend.length };
} catch (error) { report.issues.push({ item: 'audit', error: error.message }); }
finally {
  if (createdId) {
    try {
      const record = (await call('/api/v1/admin/news/' + createdId)).value;
      if (record.title !== marker) throw new Error('Cleanup guard: title does not match this run');
      const removed = await call('/api/admin/catalog', 'DELETE', { resourceKey: 'news/list', id: createdId });
      const final = (await call('/api/v1/admin/news?PageIndex=1&PageSize=500')).value;
      report.newsCleanup = { status: removed.response.status, absent: !final.items.some(item => item.id === createdId), finalTotal: final.totalCount };
    } catch (error) { report.issues.push({ item: 'cleanup', error: error.message }); }
  }
  if (cookie) await call('/api/v1/auth/logout', 'POST').catch(() => {});
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync('docs/ADMIN_ROUTES_RESULTS_2026-10-02.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ routeCount: report.routes.length, failedRoutes: report.routes.filter(item => item.status !== 200), newsPagination: report.newsPagination, newsCleanup: report.newsCleanup, issues: report.issues }, null, 2));
  if (report.issues.length || report.newsCleanup?.absent === false) process.exitCode = 1;
}
