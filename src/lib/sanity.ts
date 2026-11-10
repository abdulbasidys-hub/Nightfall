import 'server-only';
import {createClient} from 'next-sanity';
import {projectListQuery, projectDetailQuery} from '@/sanity/queries.mjs';
import imageUrlBuilder from '@sanity/image-url';
import type {PortableTextBlock} from '@portabletext/types';
export type Media = {_key:string;_type:'image'|'video';asset:{_ref:string;url?:string};alt?:string;caption?:string};
export type Project = {_id:string;title:string;slug:string;summary:string;category:string;tags?:string[];classification:'concept'|'commissioned';presentationType:string;featured:boolean;coverMedia?:Media;gallery?:Media[];role?:string;context?:string;process?:PortableTextBlock[];outcome?:PortableTextBlock[];externalUrl?:string;publishedAt?:string};
export const configured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
export const client = configured ? createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2026-01-01',useCdn:false,perspective:'published'}) : null;
export async function getProjects():Promise<Project[]> {
 if(!client)return [];
 return client.fetch<Project[]>(projectListQuery,{}, {perspective:'published',cache:'no-store'});
}
export async function getProject(slug:string):Promise<Project|null>{
 if(!client)return null;
 return client.fetch<Project|null>(projectDetailQuery,{slug},{perspective:'published',cache:'no-store'});
}
export function mediaUrl(media:Media,width=1600){if(!client)return '';return imageUrlBuilder(client).image(media).width(width).auto('format').url();}
// Covers always use the original asset, including areas cropped in Studio.
export function coverUrl(media:Media,width=1600){if(!client)return '';return imageUrlBuilder(client).image(media.asset).width(width).fit('max').auto('format').url();}
export function isWideCover(media?:Media){if(!media)return false;const {width,height}=mediaDimensions(media);return width/height>=2;}
export function mediaDimensions(media:Media){const match=(media.asset._ref||media.asset.url||'').match(/-(\d+)x(\d+)[-.]/);return match?{width:Number(match[1]),height:Number(match[2])}:{width:1600,height:1000};}
