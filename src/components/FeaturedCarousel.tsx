'use client';

import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';

const INTERVAL=6000;
type Slide={id:string;title:string;node:ReactNode};

export function FeaturedCarousel({items}:{items:Slide[]}) {
  const [active,setActive]=useState(0);
  const [direction,setDirection]=useState(1);
  const [stopped,setStopped]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [unavailable,setUnavailable]=useState(false);
  const elapsed=useRef(0);
  const progress=useRef<HTMLSpanElement>(null);
  const touch=useRef<{x:number;y:number}|null>(null);
  const swiped=useRef(false);
  const paused=stopped||hovered||focused||reducedMotion||unavailable;

  const show=useCallback((index:number,nextDirection=1)=>{
    elapsed.current=0;
    if(progress.current)progress.current.style.transform='scaleX(0)';
    setDirection(nextDirection);
    setActive((index+items.length)%items.length);
  },[items.length]);

  useEffect(()=>{
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion=()=>setReducedMotion(preference.matches);
    const updateVisibility=()=>setUnavailable(document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener('change',updateMotion);
    document.addEventListener('visibilitychange',updateVisibility);
    return ()=>{
      preference.removeEventListener('change',updateMotion);
      document.removeEventListener('visibilitychange',updateVisibility);
    };
  },[]);

  useEffect(()=>{
    if(paused||items.length<2)return;
    let previous=performance.now();
    let frame:number;
    const tick=(now:number)=>{
      elapsed.current+=now-previous;
      previous=now;
      if(progress.current)progress.current.style.transform=`scaleX(${Math.min(elapsed.current/INTERVAL,1)})`;
      if(elapsed.current>=INTERVAL){show(active+1);return;}
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[active,paused,items.length,show]);

  if(!items.length)return null;
  return <section
    className="featured-carousel"
    aria-label="Featured projects"
    aria-roledescription="carousel"
    onPointerEnter={event=>{if(event.pointerType==='mouse')setHovered(true);}}
    onPointerLeave={()=>setHovered(false)}
    onFocusCapture={()=>setFocused(true)}
    onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocused(false);}}
    onKeyDown={event=>{
      if(items.length<2)return;
      if(event.key==='ArrowRight'){event.preventDefault();show(active+1);}
      if(event.key==='ArrowLeft'){event.preventDefault();show(active-1,-1);}
    }}
    onTouchStart={event=>{const point=event.touches[0];touch.current={x:point.clientX,y:point.clientY};swiped.current=false;}}
    onTouchEnd={event=>{
      if(!touch.current||items.length<2)return;
      const point=event.changedTouches[0];
      const dx=point.clientX-touch.current.x,dy=point.clientY-touch.current.y;
      if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){
        swiped.current=true;
        show(active+(dx<0?1:-1),dx<0?1:-1);
      }
      touch.current=null;
    }}
    onTouchCancel={()=>{touch.current=null;}}
    onClickCapture={event=>{if(swiped.current){event.preventDefault();swiped.current=false;}}}
  >
    <div className="featured-stage" data-direction={direction<0?'previous':'next'}>
      {items.map((item,index)=><div
        key={item.id}
        className={`featured-slide${index===active?' is-active':''}`}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index+1} of ${items.length}: ${item.title}`}
        aria-hidden={index!==active}
        inert={index!==active}
      >{item.node}</div>)}
    </div>
    {items.length>1&&<div className="featured-controls">
      <div className="featured-position" aria-live={paused?'polite':'off'} aria-atomic="true">
        <span>{String(active+1).padStart(2,'0')}</span><span aria-hidden="true"> / </span>{String(items.length).padStart(2,'0')}
      </div>
      <div className="featured-timer" aria-hidden="true"><span ref={progress}/></div>
      <div className="featured-dots" aria-label="Choose a featured project">
        {items.map((item,index)=><button key={item.id} type="button" aria-label={`Show ${item.title}`} aria-current={index===active?'true':undefined} onClick={()=>show(index,index<active?-1:1)}><span/></button>)}
      </div>
      <button type="button" className="featured-play" aria-label={stopped?'Play slideshow':'Pause slideshow'} onClick={()=>{setStopped(value=>!value);if(stopped)setFocused(false);}}>{stopped?'Play':'Pause'}</button>
      <div className="featured-arrows">
        <button type="button" aria-label="Previous featured project" onClick={()=>show(active-1,-1)}>←</button>
        <button type="button" aria-label="Next featured project" onClick={()=>show(active+1)}>→</button>
      </div>
    </div>}
  </section>;
}
