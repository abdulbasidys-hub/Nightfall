import type {Metadata} from 'next';
import {ContactForm} from '@/components/ContactForm';
import {XIcon} from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a conversation about a project, collaboration, or idea with Nightfall.',
  alternates: {canonical: '/contact'},
};

export default function Contact() {
  return <section className="contact-page light-section">
    <div className="contact-heading">
      <span className="eyebrow"><i className="status-dot"/> 04 / START A CONVERSATION</span>
      <h1>What’s<br/><em>next?</em><span aria-hidden="true">↗</span></h1>
      <p>A fresh idea. A specific challenge.<br/>Something you’re ready to build.<br/>Let’s find the way forward.</p>
      <div className="direct-contact">
        <span className="eyebrow">PREFER A DIRECT CONVERSATION?</span>
        <a className="x-contact-link" href="https://x.com/nightfallbuilds?s=11&t=DZbEBUeXrXvDTnThGEZd1A" target="_blank" rel="noopener noreferrer">
          <XIcon/><span>@nightfallbuilds</span><span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
    <ContactForm/>
  </section>;
}
