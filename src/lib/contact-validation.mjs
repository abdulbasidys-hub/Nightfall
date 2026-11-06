export const services=['Creative & Design','Websites & Digital Experiences','Automation & Systems','Technical Development','Growth & Execution','Something multidisciplinary'];
export function validateEnquiry(data){
 if(!data||typeof data!=='object'||Array.isArray(data))return {error:'Please complete the required fields.'};
 const text=(key)=>typeof data[key]==='string'?data[key].trim():'';
 const name=text('name'),email=text('email'),service=text('service'),description=text('description');
 if(name.length<1||name.length>100)return {error:'Please enter your name (up to 100 characters).'};
 if(email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return {error:'Please enter a valid email address.'};
 if(!services.includes(service))return {error:'Please choose a service area.'};
 if(description.length<20||description.length>5000)return {error:'Please describe your project in 20–5,000 characters.'};
 return {value:{name,email,service,description}};
}
