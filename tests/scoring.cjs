const assert=require('node:assert/strict'),fs=require('node:fs'),D=require('../js/data.js'),{score,resolve,roll}=require('../js/scoring.js');
assert.equal(D.questions.length,16);assert.equal(D.characters.length,17);assert.equal(new Set(D.characters.map(c=>c.id)).size,17);
const ids=new Set(D.characters.map(c=>c.id));
assert.equal(D.dimensions.length,6);assert.equal(new Set(D.dimensions).size,6);
for(const q of D.questions)for(const o of q.options){assert.equal(o.ability.length,6);assert.ok(o.ability.every(v=>Number.isInteger(v)&&v>=0&&v<=3))}
const a0=score(D,Array(16).fill(0)).abilities,a1=score(D,Array(16).fill(1)).abilities;assert.deepEqual(a0.map(a=>a.value),[43,71,47,49,64,62]);assert.notDeepEqual(a0,a1);
for(const q of D.questions){assert.equal(q.options.length,4);for(const o of q.options){assert.ok(o.reason);assert.equal(Object.keys(o.support).length,3);for(const [id,n]of Object.entries(o.support)){assert.ok(ids.has(id));assert.ok(n>=1&&n<=3)}}}
assert.throws(()=>score(D,[]));for(const bad of [-1,4,null,NaN,'0',undefined])assert.throws(()=>score(D,Array(16).fill(bad)));
assert.throws(()=>score(D,new Array(16)));assert.throws(()=>score(D,{}));
const counts=Object.fromEntries(D.characters.filter(c=>c.id!==D.hidden.id).map(c=>[c.id,0])),fixtures={},coverage={};let seed=20261103,ties=0,close=0;
for(let n=0;n<60000;n++){
 const a=Array.from({length:16},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed>>>30}),r=score(D,a);counts[r.profile.id]++;fixtures[r.profile.id]??=a;ties+=r.tied?1:0;close+=r.close?1:0;
 assert.ok(r.evidence.length>0);assert.ok(r.ranking.every(x=>x.value>=0&&x.value<=1));
 assert.equal(r.abilities.length,6);assert.ok(r.abilities.every(x=>x.value>=30&&x.value<=90));
 for(const e of r.evidence){const q=D.questions[e.index],o=q.options[a[e.index]];assert.equal(e.question,q.title);assert.equal(e.answer,o.text);assert.ok(o.support[r.profile.id]>0)}
 if(n<100){assert.deepEqual(score(D,a),r);assert.deepEqual(score({...D,characters:[...D.characters].reverse()},a),r);const b=[...a];b[0]=(b[0]+1)%4;score(D,b);assert.deepEqual(score(D,a),r)}
}
for(const c of D.characters.filter(c=>c.id!==D.hidden.id)){assert.ok(fixtures[c.id],'Unreachable character '+c.id);const maxima=D.questions.map(q=>q.options.reduce((best,o,i)=>((o.support[c.id]||0)>(q.options[best].support[c.id]||0)?i:best),0));const r=score(D,maxima);assert.ok(r.ranking.find(x=>x.character.id===c.id).value===1);coverage[c.id]={maxSupportPath:maxima,result:r.profile.id};assert.ok(c.canon&&c.similarity&&c.difference&&c.reflection)}
// Independent hand-calculated fixture: accumulate normalized evidence without invoking score.
const answers=Array.from({length:16},(_,i)=>i%4);const expected=D.characters.filter(c=>c.id!==D.hidden.id).map(c=>{let min=0,max=0,sum=0;D.questions.forEach((q,i)=>{const v=q.options.map(o=>o.support[c.id]||0);min+=Math.min(...v);max+=Math.max(...v);sum+=v[answers[i]]});return {id:c.id,value:(sum-min)/(max-min)}}).sort((a,b)=>b.value-a.value||a.id.localeCompare(b.id,'en'));
assert.equal(score(D,answers).profile.id,expected[0].id);
// Controlled tie: do not let source array order or the final answer secretly decide it.
const fake={characters:[{id:'b'},{id:'a'}],questions:[{id:'q',title:'q',options:[{text:'yes',reason:'same',support:{a:1,b:1}},{text:'no',reason:'none',support:{}}]}]};assert.ok(score(fake,[0]).tied);assert.ok(score(fake,[0]).close);assert.equal(score(fake,[0]).profile.id,'a');
assert.equal(D.hidden.oneIn,1000);assert.equal(D.hidden.id,'yoriichi');
assert.deepEqual(new Set(D.characters.map(c=>c.id)),new Set(['tanjiro','nezuko','zenitsu','inosuke','giyu','shinobu','rengoku','tengen','mitsuri','muichiro','obanai','sanemi','muzan','akaza','doma','kokushibo','yoriichi']));
assert.ok(D.questions.every(q=>q.options.every(o=>!('yoriichi' in o.support))));
const hidden=resolve(D,answers,0),regular=resolve(D,answers,1);assert.equal(hidden.profile.id,'yoriichi');assert.ok(hidden.hidden);assert.equal(hidden.regularProfile.id,regular.profile.id);assert.deepEqual(hidden.evidence,regular.evidence);assert.ok(!regular.hidden);assert.ok(!hidden.ranking.some(r=>r.character.id==='yoriichi'));
assert.deepEqual(hidden.abilities,regular.abilities,'Hidden encounter does not fabricate perfect abilities');
for(const bad of [-1,1000,null,0.1,NaN])assert.throws(()=>resolve(D,answers,bad));
let hits=0;for(let ticket=0;ticket<1000;ticket++)hits+=resolve(D,answers,ticket).hidden?1:0;assert.equal(hits,1);
let calls=0;const rng={getRandomValues(a){a[0]=calls++===0?4294967295:1000;return a}};assert.equal(roll(rng,1000),0);assert.equal(calls,2,'Reject modulo-biased tail before accepting ticket');
assert.ok(Math.min(...Object.values(counts))>60000/1000,'Hidden base rate below each regular result in fixed sample; not a claim about all real user distributions');
fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/fixtures.json',JSON.stringify(fixtures,null,2));fs.writeFileSync('test-results/scoring-report.json',JSON.stringify({status:'passed',sampledPaths:60000,counts,ties,close,coverage},null,2));console.log(JSON.stringify({status:'passed',sampledPaths:60000,counts,ties,close},null,2));
