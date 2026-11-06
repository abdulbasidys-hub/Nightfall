import nextEnv from '@next/env';
import {projectListQuery, projectDetailQuery} from '../src/sanity/queries.mjs';

nextEnv.loadEnvConfig(process.cwd(), true);
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
if (!projectId) {
  console.log('SKIPPED live Sanity checks: no project ID is saved in the local environment.');
  process.exit(0);
}
if (!/^[a-z0-9-]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) {
  console.error('FAIL: check the format of the saved Sanity project ID and dataset. Values are not printed.');
  process.exit(1);
}
async function query(queryText, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v2026-01-01/data/query/${dataset}`);
  url.searchParams.set('query', queryText);
  url.searchParams.set('perspective', 'published');
  for (const [key, value] of Object.entries(params)) url.searchParams.set('$' + key, JSON.stringify(value));
  const response = await fetch(url, {signal: AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error(`Sanity public query returned HTTP ${response.status}.`);
  const body = await response.json();
  if (body.error) throw new Error('Sanity rejected the public query.');
  return body.result;
}
try {
  const projects = await query(projectListQuery);
  if (!Array.isArray(projects)) throw new Error('Unexpected project-list response.');
  if (projects.some(p => p._id.startsWith('drafts.') || p._id.startsWith('versions.'))) throw new Error('Unexpected unpublished document.');
  console.log(`PASS unauthenticated published-content query: ${projects.length} published projects.`);
  if (!projects.length) {
    console.log('SKIPPED live project-detail and CMS image checks: no published projects exist.');
  }
  let detailCount = 0, imageCount = 0;
  for (const project of projects.slice(0, 5)) {
    const detail = await query(projectDetailQuery, {slug: project.slug});
    if (detail?._id !== project._id) throw new Error('A published project detail did not match its listing.');
    detailCount++;
    const cover = detail.coverMedia;
    if (!cover?.asset?._ref) continue;
    const match = cover.asset._ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
    if (!match) throw new Error('A project cover has an invalid image reference.');
    const imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${match[1]}-${match[2]}.${match[3]}?w=320&auto=format`;
    const image = await fetch(imageUrl, {signal: AbortSignal.timeout(15000)});
    if (!image.ok || !image.headers.get('content-type')?.startsWith('image/')) throw new Error('A project cover could not be loaded.');
    await image.body?.cancel();
    imageCount++;
  }
  if (detailCount) console.log(`PASS ${detailCount} live project-detail queries and ${imageCount} responsive cover images.`);
} catch (error) {
  // Never print request headers, environment values or SDK/provider diagnostics.
  console.error(error instanceof Error && error.message.startsWith('Sanity public query returned HTTP') ? error.message : 'FAIL live Sanity check; verify project settings and connectivity.');
  process.exitCode = 1;
}
