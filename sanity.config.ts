'use client';
import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {presentationTool,defineLocations} from 'sanity/presentation';
import {project} from './src/sanity/schema';
export default defineConfig({name:'nightfall',title:'Nightfall / Content Studio',projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID||'unconfigured',dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',basePath:'/studio',plugins:[structureTool(),presentationTool({previewUrl:{initial:'/work'},resolve:{locations:{project:defineLocations({select:{title:'title',slug:'slug.current'},resolve:doc=>({locations:doc?.slug?[{title:doc.title||'Project',href:`/work/${doc.slug}`},{title:'Work',href:'/work'}]:[{title:'Work',href:'/work'}]})})}}})],schema:{types:[project]}});
