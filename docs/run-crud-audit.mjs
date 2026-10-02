import fs from 'node:fs';
import { setTimeout as pause } from 'node:timers/promises';
process.env.AUDIT_IMPORT_ONLY = '1';
const { loader, unwrap } = await import('./run-full-api-audit.mjs');
const origin = 'http://localhost:3001';
const base = origin + '/api/v1';
const marker = 'API AUDIT ' + Date.now();
let cookie = '';
const report = { startedAt: new Date().toISOString(), marker, cases: [], created: [], cleanup: [], validation: [], issues: [] };
const journal = () => fs.writeFileSync('docs/API_AUDIT_CLEANUP_2026-10-02.json', JSON.stringify(report.created, null, 2));
async function call(url, method = 'GET', body, auth = true) {
  await pause(850);
  const response = await fetch(url, { method, redirect: 'manual', headers: { ...(auth && cookie ? { Cookie: cookie } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(45000) });
  const text = await response.text();
  let raw;
  try { raw = JSON.parse(text); } catch { raw = text; }
  let value;
  try { value = unwrap(raw); } catch { value = null; }
  return { status: response.status, raw, value, response };
}
const rows = value => Array.isArray(value) ? value : value?.items || [];
const get = async path => {
  const res = await call(base + path);
  if (res.status >= 400) throw new Error(`GET ${path}: HTTP ${res.status}`);
  return res.value;
};
const catalog = key => origin + '/api/admin/catalog?resourceKey=' + encodeURIComponent(key);
async function trackedCreate(group, resourceKey, input, listPath) {
  const res = await call(origin + '/api/admin/catalog', 'POST', { resourceKey, input });
  let record = res.value;
  if (!record?.id) {
    const list = rows(await get(listPath));
    record = list.find(item => (item.card?.title || item.title) === input.title);
  }
  if (record?.id) {
    report.created.push({ group, id: record.id, resourceKey, title: input.title, deleted: false });
    journal();
  }
  if (res.status >= 400 || !record?.id) throw new Error(`Create ${group}: HTTP ${res.status}`);
  return { record, status: res.status };
}
async function testCase(group, fn) {
  try { await fn(); } catch (error) { report.issues.push({ group, error: error.message }); }
}
try {
  const login = await call(base + '/auth/login', 'POST', { email: process.env.AUDIT_ADMIN_EMAIL, password: process.env.AUDIT_ADMIN_PASSWORD }, false);
  if (login.status !== 200) throw new Error('Login HTTP ' + login.status);
  cookie = login.response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  const baseline = {};
  for (const group of ['projects', 'news', 'jobs', 'form-submissions', 'capability-profile/pages']) {
    baseline[group] = rows(await get('/admin/' + group + (group.includes('pages') ? '?pageIndex=1&pageSize=100' : '?PageIndex=1&PageSize=500')));
  }
  report.baselineCounts = Object.fromEntries(Object.entries(baseline).map(([key, value]) => [key, value.length]));
  await testCase('projects', async () => {
    const sourceId = '7f0c8abc-9df8-4348-9012-9e85a49d1d8c';
    const originalCard = (await call(catalog('projects/list') + '&id=' + sourceId)).value;
    const originalDetail = (await call(catalog('projects/details') + '&id=' + sourceId)).value;
    const input = { ...originalCard, title: marker + ' Project', highlight: false };
    const created = await trackedCreate('projects', 'projects/list', input, '/admin/projects?PageIndex=1&PageSize=500');
    const id = created.record.id;
    const draft = await get('/projects');
    const beforeDetailPublic = rows(draft).some(item => item.id === id);
    const detail = { ...originalDetail, id, title: input.title, projectName: input.title, client: marker, description: marker + ' Project description', solutionDescription: marker + ' Solution' };
    const saved = await call(origin + '/api/admin/catalog', 'PATCH', { resourceKey: 'projects/details', id, input: detail });
    const refreshed = (await call(catalog('projects/list') + '&id=' + id)).value;
    const pub = await call(base + '/projects/' + refreshed.slug, 'GET', undefined, false);
    const page = await call(origin + '/projects/' + refreshed.slug, 'GET', undefined, false);
    const revised = await call(origin + '/api/admin/catalog', 'PATCH', { resourceKey: 'projects/list', id, input: { ...refreshed, title: input.title + ' revised' } });
    report.cases.push({ group: 'projects', create: created.status, draftExcludedFromPublic: !beforeDetailPublic, detailSave: saved.status, publicDetail: pub.status, descriptionPersisted: pub.value?.detail?.overview?.description === detail.description, localPage: page.status, localPageContainsDescription: typeof page.raw === 'string' && page.raw.includes(detail.description), update: revised.status, updatedTitleMatches: revised.value?.title === input.title + ' revised' });
  });
  await testCase('news', async () => {
    const sourceId = baseline.news[0].id;
    const template = (await call(catalog('news/list') + '&id=' + sourceId)).value;
    const input = { ...template, title: marker + ' News', body: '<p>' + marker + ' Body</p>', featured: false, highlightHome: false, __apiDetailLoaded: true };
    const created = await trackedCreate('news', 'news/list', input, '/admin/news?PageIndex=1&PageSize=500');
    const updated = await call(origin + '/api/admin/catalog', 'PATCH', { resourceKey: 'news/list', id: created.record.id, input: { ...created.record, ...input, title: input.title + ' revised' } });
    const admin = await get('/admin/news/' + created.record.id);
    const pub = await call(base + '/news/' + updated.value.slug, 'GET', undefined, false);
    const feDetail = await call(origin + '/news/' + updated.value.slug, 'GET', undefined, false);
    const list = rows(await get('/news'));
    report.cases.push({ group: 'news', create: created.status, update: updated.status, bodyPersisted: admin.content?.body === input.body, publicDetail: pub.status, publicContainsRecord: list.some(item => item.id === created.record.id), frontendDetailPage: feDetail.status, publicBodyMatchesAdmin: pub.value?.content?.body === admin.content?.body });
  });
  await testCase('jobs', async () => {
    const sourceId = baseline.jobs[0].id;
    const template = (await call(catalog('recruitment/jobs') + '&id=' + sourceId)).value;
    const input = { ...template, title: marker + ' Job', summary: marker + ' Summary', __apiDetailLoaded: true };
    const created = await trackedCreate('jobs', 'recruitment/jobs', input, '/admin/jobs?PageIndex=1&PageSize=500');
    const updated = await call(origin + '/api/admin/catalog', 'PATCH', { resourceKey: 'recruitment/jobs', id: created.record.id, input: { ...created.record, ...input, summary: marker + ' Updated summary' } });
    const pub = rows(await get('/jobs')).find(item => item.id === created.record.id);
    report.cases.push({ group: 'jobs', create: created.status, update: updated.status, publicContainsRecord: !!pub, summaryMatches: pub?.summary === marker + ' Updated summary', responsibilitiesPresent: !!pub?.responsibilities?.length, benefitsPresent: !!pub?.benefits?.length });
  });
  await testCase('capability-profile/pages', async () => {
    const template = baseline['capability-profile/pages'][0];
    const input = { title: marker + ' Profile page', imageUrl: template.imageUrl, metadata: { sortOrder: baseline['capability-profile/pages'].length + 1 } };
    const created = await call(base + '/admin/capability-profile/pages', 'POST', input);
    const record = created.value;
    if (!record?.id) throw new Error('Create profile page missing ID: HTTP ' + created.status);
    report.created.push({ group: 'capability-profile/pages', id: record.id, title: input.title, deleted: false }); journal();
    const updated = await call(base + '/admin/capability-profile/pages/' + record.id, 'PATCH', { ...input, title: input.title + ' revised' });
    const pub = rows(await get('/capability-profile/pages')).find(item => item.id === record.id);
    report.cases.push({ group: 'capability-profile/pages', create: created.status, update: updated.status, publicContainsRecord: !!pub, publicImageMatches: pub?.imageUrl === input.imageUrl, publicOrderMatches: pub?.metadata?.sortOrder === input.metadata.sortOrder });
  });
  await testCase('form-submissions', async () => {
    const name = marker + ' Contact';
    const created = await call(origin + '/api/form-submissions', 'POST', { customerName: name, phone: '0000000000' }, false);
    const list = (await call(origin + '/api/admin/form-submissions?pageIndex=1&pageSize=100')).value;
    const record = list.items.find(item => item.customerName === name);
    if (!record) throw new Error('Submitted contact not found: HTTP ' + created.status);
    report.created.push({ group: 'form-submissions', id: record.id, title: name, deleted: false }); journal();
    const reviewed = await call(origin + '/api/admin/form-submissions', 'PATCH', { id: record.id, status: 'done' });
    const read = await call(origin + '/api/admin/form-submissions', 'PATCH', { id: record.id, isRead: true });
    const filtered = (await call(origin + '/api/admin/form-submissions?pageIndex=1&pageSize=2&status=done')).value;
    report.cases.push({ group: 'form-submissions', create: created.status, adminContainsRecord: !!record, update: reviewed.status, reviewedMatches: reviewed.value?.status === 'done', readStatus: read.status, isReadMatches: read.value?.isRead === true, filterAllDone: filtered.items.every(item => item.status === 'done'), paginationRespected: filtered.items.length <= 2 && filtered.pageSize === 2 });
  });
  for (const [label, url, body] of [
    ['empty contact', origin + '/api/form-submissions', {}],
    ['quotation area below minimum', base + '/quotation/estimate', { buildingType: 'nha_o', serviceType: 'xay_dung_tron_goi', areaM2: 9 }],
    ['quotation area above maximum', base + '/quotation/estimate', { buildingType: 'nha_o', serviceType: 'xay_dung_tron_goi', areaM2: 50001 }],
    ['quotation invalid building code', base + '/quotation/estimate', { buildingType: 'invalid', serviceType: 'xay_dung_tron_goi', areaM2: 100 }],
  ]) {
    const res = await call(url, 'POST', body, false);
    report.validation.push({ label, status: res.status, rejected: res.status === 400 || res.status === 422 });
  }
  const [projectsApiValue, categoriesApiValue, pageApiValue] = [await get('/projects'), await get('/project-categories'), await get('/pages/projects')];
  const normal = loader()('features/projects/api/get-projects-public-data.ts').buildProjectsPublicData({ projectsApiValue, categoriesApiValue, pageApiValue });
  const broken = loader({ '@/shared/lib/api/server': { getPublicApiValue: async endpoint => { if (endpoint === '/project-categories') throw new Error('Injected category outage'); return endpoint === '/projects' ? projectsApiValue : pageApiValue; } } }, { console: { warn() {}, log() {} } })('shared/lib/api/public-data.ts');
  const fallback = await broken.getProjectsData();
  report.partialFailure = { availableProjectCount: normal.projects.length, countAfterCategoryFailure: fallback.projects.length, discardedSuccessfulProjectResponse: normal.projects.length > 0 && fallback.projects.length === 0 };
} catch (error) { report.issues.push({ group: 'audit', error: error.message }); }
finally {
  // Delete only IDs registered from this run's explicitly authorized creations.
  for (const record of [...report.created].reverse()) {
    try {
      if (!record.title.startsWith(marker)) throw new Error('Cleanup guard rejected unexpected record');
      const url = record.group === 'form-submissions' ? origin + '/api/admin/form-submissions' : record.resourceKey ? origin + '/api/admin/catalog' : base + '/admin/' + record.group + '/' + record.id;
      const body = record.group === 'form-submissions' ? { id: record.id } : record.resourceKey ? { resourceKey: record.resourceKey, id: record.id } : undefined;
      const removed = await call(url, 'DELETE', body);
      const remaining = rows(await get('/admin/' + record.group + (record.group.includes('pages') ? '?pageIndex=1&pageSize=100' : '?PageIndex=1&PageSize=500')));
      record.deleted = !remaining.some(item => item.id === record.id);
      journal();
      report.cleanup.push({ group: record.group, id: record.id, status: removed.status, absentFromAdmin: record.deleted });
    } catch (error) { report.issues.push({ group: 'cleanup:' + record.group, error: error.message }); }
  }
  report.finalCounts = {};
  for (const group of ['projects', 'news', 'jobs', 'form-submissions', 'capability-profile/pages']) {
    try { report.finalCounts[group] = rows(await get('/admin/' + group + (group.includes('pages') ? '?pageIndex=1&pageSize=100' : '?PageIndex=1&PageSize=500'))).length; } catch (error) { report.issues.push(error.message); }
  }
  if (cookie) await call(base + '/auth/logout', 'POST').catch(() => {});
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync('docs/CRUD_AUDIT_RESULTS_2026-10-02.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (report.created.some(item => !item.deleted) || report.issues.length) process.exitCode = 1;
}
