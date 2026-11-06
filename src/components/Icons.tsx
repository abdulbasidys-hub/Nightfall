type IconProps = {className?: string};

export function CapabilityIcon({kind}: {kind: 'design' | 'code' | 'automation' | 'growth'}) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'design' && <><path d="m16 3 10 17-5 9H11l-5-9L16 3Z"/><path d="M16 3v13"/><circle className="icon-accent" cx="16" cy="19" r="3"/></>}
    {kind === 'code' && <><path className="icon-accent" d="m10 9-7 7 7 7m12-14 7 7-7 7"/><path d="m19 5-6 22"/></>}
    {kind === 'automation' && <><path d="m12 3-1 4-3 2-4-1-2 7 4 2 1 3-2 4 6 5 3-3h4l3 3 6-5-2-4 1-3 4-2-2-7-4 1-3-2-1-4h-8Z"/><circle className="icon-accent" cx="16" cy="16" r="5"/></>}
    {kind === 'growth' && <><path d="M4 22h5v7H4zm9-5h5v12h-5zm9-6h5v18h-5Z"/><path className="icon-accent" d="m4 15 9-5 5 1 10-8m-7 0h7v7"/></>}
  </svg>;
}

export function XIcon({className}: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.5 5.5 22H2.3l7.9-9L.8 2h6.5l5.7 7.1L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20Z"/></svg>;
}
