'use client';

import {useRef, useState} from 'react';
import {validateEnquiry} from '@/lib/contact-validation.mjs';

type Field = 'name' | 'email' | 'subject' | 'message';
type FieldErrors = Partial<Record<Field, string>>;

export function ContactForm() {
  const started = useRef(Date.now());
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  function showErrors(form: HTMLFormElement, nextErrors: FieldErrors) {
    setErrors(nextErrors);
    requestAnimationFrame(() => {
      const first = Object.keys(nextErrors)[0];
      if (!first) return;
      const control = form.elements.namedItem(first);
      if (control instanceof HTMLElement) control.focus();
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const validated = validateEnquiry(data);
    setFeedback('');
    if (validated.error) {
      setStatus('error');
      setFeedback(validated.error);
      showErrors(form, validated.errors || {});
      return;
    }
    setErrors({});
    setStatus('sending');
    let failureMessage = 'Your enquiry could not be delivered. Please try again later or contact Nightfall on X.';
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data, startedAt: started.current}),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        if (result?.errors) showErrors(form, result.errors);
        if (typeof result?.error === 'string') failureMessage = result.error;
        throw new Error('The server did not accept the enquiry.');
      }
      setStatus('success');
      setFeedback('Your enquiry has been accepted for delivery. Thank you for getting in touch.');
      form.reset();
    } catch {
      setStatus('error');
      setFeedback(failureMessage);
    }
  }

  const fieldState = (field: Field) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
  });
  const fieldError = (field: Field) => errors[field] && <p id={`contact-${field}-error`} className="field-error">{errors[field]}</p>;

  return <form onSubmit={submit} className="contact-form" aria-label="Project enquiry" aria-busy={status === 'sending'} noValidate>
    <p className="form-note">Tell us what you have in mind. <span>* Required fields</span></p>
    <div className="form-pair">
      <div className="form-field">
        <label htmlFor="contact-name">Your name <span>*</span></label>
        <input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="What should we call you?" {...fieldState('name')}/>
        {fieldError('name')}
      </div>
      <div className="form-field">
        <label htmlFor="contact-email">Email address <span>*</span></label>
        <input id="contact-email" type="email" name="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} required maxLength={254} placeholder="Where can we reach you?" {...fieldState('email')}/>
        {fieldError('email')}
      </div>
    </div>
    <div className="form-field">
      <label htmlFor="contact-subject">Subject <span>*</span></label>
      <input id="contact-subject" name="subject" required minLength={3} maxLength={160} placeholder="What would you like to discuss?" {...fieldState('subject')}/>
      {fieldError('subject')}
    </div>
    <div className="form-field">
      <label htmlFor="contact-message">Message <span>*</span></label>
      <textarea id="contact-message" name="message" required minLength={20} maxLength={5000} rows={5} placeholder="The idea, the challenge, and what you have in mind." {...fieldState('message')}/>
      {fieldError('message')}
    </div>
    <div className="honeypot" aria-hidden="true">
      <label htmlFor="contact-website">Website</label>
      <input id="contact-website" name="website" tabIndex={-1} autoComplete="off"/>
    </div>
    <p className="form-disclosure">Your details are used to respond to this enquiry. Please avoid sharing sensitive information.</p>
    <button className="submit-button" disabled={status === 'sending'}>
      {status === 'sending' ? 'Sending…' : 'Send your enquiry'}<span aria-hidden="true">↗</span>
    </button>
    <p role={status === 'error' ? 'alert' : 'status'} className={`form-status ${status}`}>{feedback}</p>
  </form>;
}
