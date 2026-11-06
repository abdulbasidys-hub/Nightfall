import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
for(const route of ['/','/work','/services','/about','/contact','/studio','/robots.txt','/sitemap.xml','/opengraph-image','/icon.svg']){
 const response=await fetch(base+route);assert.equal(response.status,200,route);if(route==='/opengraph-image')assert.match(response.headers.get('content-type'),/image\/png/);console.log(`PASS ${route}`);
}
for(const route of ['/this-page-does-not-exist','/work/this-project-does-not-exist'])assert.equal((await fetch(base+route)).status,404,route);
assert.equal((await fetch(base+'/api/draft-mode/enable')).status,503,'preview fails closed without configuration');
const post=(body,origin=base)=>fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json',origin},body:JSON.stringify(body)});
assert.equal((await post({})).status,400,'invalid form rejected');
assert.equal((await post({},'https://untrusted.example')).status,403,'cross-origin form rejected');
const body={name:'Local QA',email:'qa@example.com',service:'Creative & Design',description:'Local validation check without an actual mail send.',startedAt:Date.now()-10000};
assert.equal((await post({...body,startedAt:Date.now()+10000})).status,429,'unreasonable submission time rejected');
const result=await post(body);assert.equal(result.status,503,'unconfigured form reports unavailable');assert.match((await result.json()).error,/not configured/);
const sitemap=await (await fetch(base+'/sitemap.xml')).text();assert.ok(!sitemap.includes('/studio'));
console.log('PASS 404s, draft protection, form validation, origin check, timing, unavailable state, sitemap');
