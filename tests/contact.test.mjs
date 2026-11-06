import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEnquiry} from '../src/lib/contact-validation.mjs';
const enquiry={name:'Alex',email:'alex@example.com',service:'Creative & Design',description:'I would like to discuss a visual identity.'};
test('accepts an enquiry and trims inputs',()=>{const r=validateEnquiry({...enquiry,name:' Alex '});assert.equal(r.value.name,'Alex');assert.equal(r.value.budget,'');});
test('rejects invalid email, unknown service and short description',()=>{for(const bad of [{email:'invalid'},{service:'unknown'},{description:'short'},{description:'x'.repeat(5001)}])assert.ok(validateEnquiry({...enquiry,...bad}).error);});
test('rejects non-object payloads and non-string fields',()=>{for(const bad of [null,[],{}, {...enquiry,name:42}])assert.ok(validateEnquiry(bad).error);});
