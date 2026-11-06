import type {Metadata} from 'next';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Shared';
import {siteUrl} from '@/lib/site';
import './globals.css';
import './contact.css';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Nightfall — Ideas into existence.',template:'%s — Nightfall'},description:'A multidisciplinary digital execution studio. Creative, websites, products, automation and launch support.',openGraph:{title:'Nightfall — Ideas into existence.',description:'Creative thinking. Technical execution. One connected practice.',type:'website',images:['/opengraph-image']},twitter:{card:'summary_large_image'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>}
