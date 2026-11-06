import {NextResponse} from 'next/server';
import {validateEnquiry} from '@/lib/contact-validation.mjs';
export async function POST(request:Request){
 const origin=request.headers.get('origin');const requestUrl=new URL(request.url);const expectedOrigin=requestUrl.protocol+'//'+(request.headers.get('host')||requestUrl.host);if(!origin||origin!==expectedOrigin)return NextResponse.json({error:'Please submit the form from this website.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>20000)return NextResponse.json({error:'Your enquiry is too long.'},{status:413});
 let data;try{const raw=await request.text();if(raw.length>20000)return NextResponse.json({error:'Your enquiry is too long.'},{status:413});data=JSON.parse(raw);}catch{return NextResponse.json({error:'Invalid request.'},{status:400});}
 const validated=validateEnquiry(data);if(validated.error)return NextResponse.json({error:validated.error},{status:400});
 if(data.website)return NextResponse.json({success:true});
 if(typeof data.startedAt!=='number'||Date.now()-data.startedAt<3000)return NextResponse.json({error:'Please take a moment to review your enquiry, then send again.'},{status:429});
 const {RESEND_API_KEY,CONTACT_FROM_EMAIL,CONTACT_TO_EMAIL,TURNSTILE_SECRET_KEY}=process.env;
 if(!RESEND_API_KEY||!CONTACT_FROM_EMAIL||!CONTACT_TO_EMAIL||!TURNSTILE_SECRET_KEY)return NextResponse.json({error:'Enquiry delivery is not configured yet. Please use a direct contact option when available.'},{status:503});
 try{
 const challenge=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:TURNSTILE_SECRET_KEY,response:String(data['cf-turnstile-response']||'')})});const verification=await challenge.json();if(!verification.success)return NextResponse.json({error:'Please complete the spam check and try again.'},{status:400});
 const v=validated.value!;const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:CONTACT_FROM_EMAIL,to:[CONTACT_TO_EMAIL],reply_to:v.email,subject:`Nightfall enquiry: ${v.service}`,text:`Name: ${v.name}\nEmail: ${v.email}\nService: ${v.service}\n\n${v.description}`})});if(!sent.ok)throw new Error('Delivery failed');return NextResponse.json({success:true});
 }catch{return NextResponse.json({error:'Your enquiry could not be delivered. Please try again shortly.'},{status:502});}
}
