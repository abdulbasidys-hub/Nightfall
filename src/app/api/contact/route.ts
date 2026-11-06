import {createContactHandler} from '@/lib/contact-handler.mjs';
import {sendContactNotification} from '@/lib/contact-delivery.mjs';

export const runtime = 'nodejs';
export const POST = createContactHandler({
  getConfig: () => ({
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL,
  }),
  sendEmail: sendContactNotification,
});
