const assert=require('node:assert/strict'),fs=require('node:fs'),D=require('../js/data.js'),{score}=require('../js/scoring.js');
assert.equal(D.questions.length,12);assert.equal(D.characters.length,12);assert.equal(new Set(D.characters.map(c=>c.id)).size,12);
const ids=new Set(D.characters.map(c=>c.id));
for(const q of D.questions){assert.equal(q.options.length,4);for(const o of q.options){assert.ok(o.reason);assert.equal(Object.keys(o.support).length,3);for(const [id,n]of Object.entries(o.support)){assert.ok(ids.has(id));assert.ok(n>=1&&n<=3)}}}
assert.throws(()=>score(D,[]));for(const bad of [-1,4,null,NaN,'0',undefined])assert.throws(()=>score(D,Array(12).fill(bad)));
assert.throws(()=>score(D,new Array(12)));assert.throws(()=>score(D,{}));
const counts=Object.fromEntries(D.characters.map(c=>[c.id,0])),fixtures={},coverage={};let seed=20261103,ties=0,close=0;
for(let n=0;n<60000;n++){
 const a=Array.from({length:12},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed>>>30}),r=score(D,a);counts[r.profile.id]++;fixtures[r.profile.id]??=a;ties+=r.tied?1:0;close+=r.close?1:0;
 assert.ok(r.evidence.length>0);assert.ok(r.ranking.every(x=>x.value>=0&&x.value<=1));
 for(const e of r.evidence){const q=D.questions[e.index],o=q.options[a[e.index]];assert.equal(e.question,q.title);assert.equal(e.answer,o.text);assert.ok(o.support[r.profile.id]>0)}
 if(n<100){assert.deepEqual(score(D,a),r);assert.deepEqual(score({...D,characters:[...D.characters].reverse()},a),r);const b=[...a];b[0]=(b[0]+1)%4;score(D,b);assert.deepEqual(score(D,a),r)}
}
for(const c of D.characters){assert.ok(fixtures[c.id],'Unreachable character '+c.id);const maxima=D.questions.map(q=>q.options.reduce((best,o,i)=>((o.support[c.id]||0)>(q.options[best].support[c.id]||0)?i:best),0));const r=score(D,maxima);assert.ok(r.ranking.find(x=>x.character.id===c.id).value===1);coverage[c.id]={maxSupportPath:maxima,result:r.profile.id};assert.ok(c.canon&&c.similarity&&c.difference&&c.reflection)}
// Independent hand-calculated fixture: accumulate normalized evidence without invoking score.
const answers=[0,1,2,3,0,1,2,3,0,1,2,3];const expected=D.characters.map(c=>{let min=0,max=0,sum=0;D.questions.forEach((q,i)=>{const v=q.options.map(o=>o.support[c.id]||0);min+=Math.min(...v);max+=Math.max(...v);sum+=v[answers[i]]});return {id:c.id,value:(sum-min)/(max-min)}}).sort((a,b)=>b.value-a.value||a.id.localeCompare(b.id,'en'));
assert.equal(score(D,answers).profile.id,expected[0].id);
// Controlled tie: do not let source array order or the final answer secretly decide it.
const fake={characters:[{id:'b'},{id:'a'}],questions:[{id:'q',title:'q',options:[{text:'yes',reason:'same',support:{a:1,b:1}},{text:'no',reason:'none',support:{}}]}]};assert.ok(score(fake,[0]).tied);assert.ok(score(fake,[0]).close);assert.equal(score(fake,[0]).profile.id,'a');
fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/fixtures.json',JSON.stringify(fixtures,null,2));fs.writeFileSync('test-results/scoring-report.json',JSON.stringify({status:'passed',sampledPaths:60000,counts,ties,close,coverage},null,2));console.log(JSON.stringify({status:'passed',sampledPaths:60000,counts,ties,close},null,2));
