export const publishedProjectFilter = '_type == "project" && defined(slug.current) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))';

export const projectFields = `
  _id, title, "slug": slug.current, summary, category, tags,
  classification, presentationType, featured, displayOrder,
  coverMedia,
  gallery[]{..., "asset": asset->{_id, "_ref": _id, url}},
  role, context, process, outcome, externalUrl, publishedAt
`;

export const projectListQuery = `*[${publishedProjectFilter}] | order(displayOrder asc, publishedAt desc){${projectFields}}`;
export const projectDetailQuery = `*[${publishedProjectFilter} && slug.current == $slug][0]{${projectFields}}`;
export const projectSitemapQuery = `*[${publishedProjectFilter}]{"slug": slug.current}`;
