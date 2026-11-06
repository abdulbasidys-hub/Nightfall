import test from 'node:test';
import assert from 'node:assert/strict';
import {parse, evaluate} from 'groq-js';
import {projectListQuery, projectDetailQuery, projectSitemapQuery} from '../src/sanity/queries.mjs';

const project = {
  _id: 'published-project', _type: 'project', title: 'Test fixture', slug: {current: 'test-fixture'},
  summary: 'Test-only content, never published to Sanity.', category: 'Creative & Design', classification: 'concept',
  presentationType: 'editorial_gallery', featured: true, displayOrder: 1,
  coverMedia: {_type: 'image', asset: {_ref: 'image-fixture-1200x800-png'}, alt: 'Test fixture'},
  gallery: [{_key: 'image', _type: 'image', asset: {_ref: 'image-fixture-1200x800-png'}, alt: 'Test fixture'}],
};
const dataset = [project,
  {...project, _id: 'drafts.published-project', title: 'Private draft'},
  {...project, _id: 'versions.release.published-project', title: 'Private release'},
  {...project, _id: 'no-slug', slug: null},
  {_id: 'image-fixture-1200x800-png', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/images/test/production/fixture-1200x800.png'},
];
const run = async (query, params = {}) => (await evaluate(parse(query), {dataset, params})).get();

test('project listings exclude drafts, release versions and documents without slugs', async () => {
  const items = await run(projectListQuery);
  assert.equal(items.length, 1);
  assert.equal(items[0]._id, project._id);
  assert.equal(items[0].slug, 'test-fixture');
  assert.equal(items[0].classification, 'concept');
});

test('project details preserve media references and use a safe parameterized slug', async () => {
  const result = await run(projectDetailQuery, {slug: 'test-fixture'});
  assert.equal(result.title, project.title);
  assert.equal(result.coverMedia.asset._ref, 'image-fixture-1200x800-png');
  assert.equal(result.gallery[0].asset._ref, 'image-fixture-1200x800-png');
  assert.match(result.gallery[0].asset.url, /^https:\/\/cdn\.sanity\.io\//);
  assert.equal(await run(projectDetailQuery, {slug: 'missing-project'}), null);
  assert.equal(await run(projectDetailQuery, {slug: 'test-fixture"] | *[_type == "project"'}), null);
});

test('the sitemap includes only published project slugs', async () => {
  assert.deepEqual(await run(projectSitemapQuery), [{slug: 'test-fixture'}]);
});
