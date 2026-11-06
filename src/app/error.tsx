'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="section-pad setup-state"><span className="eyebrow">A MOMENTARY INTERRUPTION</span><h1>Let’s try that again.</h1><p>We couldn’t load this page. Please try again in a moment.</p><button className="submit-button" onClick={reset}>Try again ↗</button></section>}
