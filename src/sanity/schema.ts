import {defineField,defineType} from 'sanity';
const presentations=['product_showcase','editorial_gallery','website_preview','video_showcase','case_study','interactive_demo'];
const richText=(name:string,title:string)=>defineField({name,title,type:'array',of:[{type:'block'}]});
export const project=defineType({name:'project',title:'Project',type:'document',groups:[{name:'details',title:'Details',default:true},{name:'story',title:'Story & media'},{name:'publishing',title:'Publishing'}],fields:[
 defineField({name:'title',type:'string',group:'details',validation:r=>r.required()}),
 defineField({name:'slug',type:'slug',group:'details',options:{source:'title',maxLength:96},validation:r=>r.required()}),
 defineField({name:'summary',type:'text',rows:3,group:'details',validation:r=>r.required().max(400)}),
 defineField({name:'category',type:'string',group:'details',options:{list:['Web3 & Crypto','Websites & Digital Experiences','Creative & Design','Automation & Systems','Product & Development','Growth & Campaign Execution']},validation:r=>r.required()}),
 defineField({name:'tags',type:'array',of:[{type:'string'}],group:'details',options:{layout:'tags'}}),
 defineField({name:'classification',type:'string',group:'details',options:{list:[{title:'Concept / self-initiated',value:'concept'},{title:'Commissioned / client work',value:'commissioned'}],layout:'radio'},validation:r=>r.required()}),
 defineField({name:'presentationType',type:'string',group:'details',options:{list:presentations.map(value=>({title:value.replaceAll('_',' '),value}))},initialValue:'editorial_gallery',validation:r=>r.required()}),
 defineField({name:'role',title:'Nightfall’s role / contribution',type:'text',rows:2,group:'details'}),
 defineField({name:'coverMedia',type:'image',group:'story',options:{hotspot:true},fields:[{name:'alt',type:'string',title:'Alternative text',validation:r=>r.required()}],validation:r=>r.required()}),
 defineField({name:'gallery',type:'array',group:'story',of:[{type:'image',options:{hotspot:true},fields:[{name:'alt',type:'string',validation:r=>r.required()},{name:'caption',type:'string'}]},{type:'file',name:'video',title:'Video',options:{accept:'video/*'},fields:[{name:'caption',type:'string'}]}]}),
 defineField({name:'context',type:'text',group:'story'}),
 {...richText('process','Execution / process'),group:'story'},
 {...richText('outcome','Outcome — supplied facts only'),group:'story'},
 defineField({name:'externalUrl',type:'url',group:'story',validation:r=>r.uri({scheme:['http','https']})}),
 defineField({name:'featured',type:'boolean',group:'publishing',initialValue:false}),
 defineField({name:'displayOrder',type:'number',group:'publishing',initialValue:100}),
 defineField({name:'publishedAt',type:'datetime',group:'publishing'}),
 ],preview:{select:{title:'title',subtitle:'classification',media:'coverMedia'}},orderings:[{title:'Display order',name:'displayOrder',by:[{field:'displayOrder',direction:'asc'}]}]});
