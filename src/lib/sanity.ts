import 'server-only';
import {createClient} from 'next-sanity';
import {draftMode} from 'next/headers';
import imageUrlBuilder from '@sanity/image-url';
import type {PortableTextBlock} from '@portabletext/types';
export type Media = {_key:string;_type:'image'|'video';asset:{_ref:string;url?:string};alt?:string;caption?:string};
export type Project = {_id:string;title:string;slug:string;summary:string;category:string;tags?:string[];classification:'concept'|'commissioned';presentationType:string;featured:boolean;coverMedia?:Media;gallery?:Media[];role?:string;context?:string;process?:PortableTextBlock[];outcome?:PortableTextBlock[];externalUrl?:string;publishedAt?:string};
export const configured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
export const client = configured ? createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2026-01-01',useCdn:false,perspective:'published',token:process.env.SANITY_API_READ_TOKEN}) : null;
const fields = `_id,title,"slug":slug.current,summary,category,tags,classification,presentationType,featured,coverMedia,gallery[]{...,asset->{_id,url}},role,context,process,outcome,externalUrl,publishedAt`;
export async function getProjects():Promise<Project[]> {
 if(!client)return [];
 const preview=(await draftMode()).isEnabled;
 return client.fetch(`*[_type == "project"] | order(displayOrder asc, publishedAt desc){${fields}}`,{}, {perspective:preview?'drafts':'published',token:process.env.SANITY_API_READ_TOKEN,cache:'no-store'});
}
export async function getProject(slug:string):Promise<Project|null>{return (await getProjects()).find(p=>p.slug===slug)||null;}
export function mediaUrl(media:Media,width=1600){if(!client)return '';return imageUrlBuilder(client).image(media).width(width).auto('format').url();}
export function mediaDimensions(media:Media){const match=(media.asset._ref||media.asset.url||'').match(/-(\d+)x(\d+)[-.]/);return match?{width:Number(match[1]),height:Number(match[2])}:{width:1600,height:1000};}
