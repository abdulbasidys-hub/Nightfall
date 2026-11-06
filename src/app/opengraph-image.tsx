import {ImageResponse} from 'next/og';
export const alt='Nightfall — Ideas into existence';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function OG(){return new ImageResponse(<div style={{background:'#080a0a',color:'#f5f7f6',width:'100%',height:'100%',display:'flex',flexDirection:'column',padding:'64px',justifyContent:'space-between'}}><div style={{fontSize:32}}>nightfall*</div><div style={{fontSize:100,lineHeight:1,letterSpacing:-6,display:'flex',flexDirection:'column'}}><span>Ideas into</span><span style={{color:'#00e676'}}>existence</span></div></div>,size);}
