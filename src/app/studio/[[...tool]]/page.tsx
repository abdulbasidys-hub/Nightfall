import {NextStudio} from 'next-sanity/studio';
import config from '../../../../sanity.config';
export const dynamic='force-dynamic';
export const metadata={title:'Content Studio',robots:{index:false,follow:false}};
export default function Studio(){return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?<div className="studio-shell"><NextStudio config={config}/></div>:<section className="section-pad setup-state"><span className="eyebrow">NIGHTFALL / CONTENT STUDIO</span><h1>Ready to connect</h1><p>Configure the Sanity project ID and dataset to open the authenticated content studio. See README.md for setup instructions.</p></section>}
