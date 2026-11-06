import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/site';
import {client} from '@/lib/sanity';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const projects=client?await client.fetch<{slug:string}[]>('*[_type == "project"]{"slug":slug.current}',{},{perspective:'published',cache:'no-store'}):[];return ['', '/work','/services','/about','/contact',...projects.map(p=>`/work/${p.slug}`)].map(route=>({url:`${siteUrl}${route}`}));}
