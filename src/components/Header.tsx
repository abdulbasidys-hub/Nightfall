'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
export function Header(){const [open,setOpen]=useState(false);const path=usePathname();return <header className="header"><Link href="/" className="wordmark" aria-label="Nightfall home">nightfall<span aria-hidden="true">*</span></Link><button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(!open)}>{open?'Close −':'Menu +'}</button><nav id="main-nav" className={open?'nav open':'nav'} aria-label="Main navigation">{[['Home','/'],['Work','/work'],['Services','/services'],['About','/about']].map(([label,url])=><Link key={url} href={url} aria-current={path===url?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}<Link className="nav-contact" href="/contact" onClick={()=>setOpen(false)}>Let’s talk <span>↗</span></Link></nav></header>}
