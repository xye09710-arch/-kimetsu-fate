const assert=require('node:assert/strict'),D=require('../js/data.js'),{score}=require('../js/scoring.js');
assert.equal(D.questions.length,12);assert.equal(new Set(D.questions.map(q=>q.id)).size,12);assert.equal(D.profiles.length,8);
for(const q of D.questions){assert.equal(q.options.length,4);for(const o of q.options){assert.ok([-2,-1,1,2].includes(o.faction));assert.ok(o.trait>=0&&o.trait<4)}}
assert.throws(()=>score(D,[]));for(const bad of [-1,4,null,NaN,'0'])assert.throws(()=>score(D,Array(12).fill(bad)));
assert.equal(score(D,Array(12).fill(0)).profile.id,'slayer-0');assert.equal(score(D,Array(12).fill(1)).profile.id,'slayer-1');assert.equal(score(D,Array(12).fill(2)).profile.id,'demon-2');assert.equal(score(D,Array(12).fill(3)).profile.id,'demon-3');
// Exact faction tie with last choice positive and negative.
let ties=0;const reachable=new Map(),distribution={slayer:0,demon:0};let seed=20261101;
for(let n=0;n<60000;n++){const a=Array.from({length:12},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed>>>30});const r=score(D,a);assert.deepEqual(score(D,a),r);assert.equal(r.traits.reduce((x,y)=>x+y),12);assert.ok(r.profile);distribution[r.faction]++;if(!reachable.has(r.profile.id))reachable.set(r.profile.id,a);if(r.factionScore===0){ties++;assert.equal(r.faction,D.questions[11].options[a[11]].faction>0?'slayer':'demon')}assert.ok(r.evidence.length>=1);assert.ok(r.evidence.every(e=>e.trait===r.trait));const m=Math.max(...r.traits);const expected=[...a].reverse().map((a,j)=>D.questions[11-j].options[a]).find(o=>r.traits[o.trait]===m).trait;assert.equal(r.trait,expected)}
assert.equal(reachable.size,8);assert.ok(ties>0);for(const p of D.profiles){assert.equal(p.story.length,3);assert.ok(p.story.join('').length>200)}
require('node:fs').mkdirSync('test-results',{recursive:true});require('node:fs').writeFileSync('test-results/fixtures.json',JSON.stringify(Object.fromEntries(reachable),null,2));
console.log(JSON.stringify({status:'passed',sampledPaths:60000,reachableProfiles:reachable.size,factionTies:ties,distribution},null,2));
