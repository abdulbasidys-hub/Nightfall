/** Validate the same four fields in the browser and on the server. */
export function validateEnquiry(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {error: 'Please complete the required fields.', errors: {name: 'Enter your name.'}};
  }

  const text = key => typeof data[key] === 'string' ? data[key].trim() : '';
  const value = {name: text('name'), email: text('email'), subject: text('subject'), message: text('message')};
  const errors = {};
  if (!value.name || value.name.length > 100 || /[\r\n]/.test(value.name)) {
    errors.name = 'Enter your name using up to 100 characters.';
  }
  if (value.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
    errors.email = 'Enter a valid email address so we can reply.';
  }
  if (value.subject.length < 3 || value.subject.length > 160 || /[\r\n]/.test(value.subject)) {
    errors.subject = 'Enter a subject between 3 and 160 characters.';
  }
  if (value.message.length < 20 || value.message.length > 5000) {
    errors.message = 'Enter a message between 20 and 5,000 characters.';
  }
  if (Object.keys(errors).length) return {error: 'Please check the highlighted fields.', errors};
  return {value};
}
