import {defineEnableDraftMode} from 'next-sanity/draft-mode';
import {client} from '@/lib/sanity';
export async function GET(request:Request){if(!client||!process.env.SANITY_API_READ_TOKEN)return new Response('Preview is not configured.',{status:503});const handler=defineEnableDraftMode({client:client.withConfig({token:process.env.SANITY_API_READ_TOKEN})});return handler.GET(request);}
