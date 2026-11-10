import type {Metadata} from 'next';
import {PageIntro,CTA} from '@/components/Shared';
import {EmptyWork,ProjectCard} from '@/components/Projects';
import {WorkFilter} from '@/components/WorkFilter';
import {getProjects,isWideCover} from '@/lib/sanity';
export const metadata:Metadata={title:'Work',description:'Explore selected projects and the creative archive from Nightfall.',alternates:{canonical:'/work'}};
export default async function Work(){const projects=await getProjects();return <><PageIntro number="01" label="THE EXHIBITION" title={<>Different forms<br/><em>Same intent</em></>} description="A collection of ideas made tangible. Design, digital products, websites, and the details in between."/><section className="work-body light-section">{projects.length?<WorkFilter items={projects.map((p,i)=>({id:p._id,category:p.category,featured:p.featured,wide:isWideCover(p.coverMedia),node:<ProjectCard project={p} index={i}/>}))}/>:<EmptyWork/>}</section><CTA/></>}
