const assert=require('node:assert/strict');
const D=require('../js/data'),R=require('../js/report'),{score}=require('../js/scoring');
// Copy edits must not alter confirmed question text, supports, ability inputs or hidden probability.
const {createHash}=require('node:crypto');
assert.equal(createHash('sha256').update(JSON.stringify({questions:D.questions,hidden:D.hidden,dimensions:D.dimensions})).digest('hex'),'65af0d54de862913cb631861c3a9376a3b36ad67dabdde265fcde7773c6d552a');
const abilities=values=>values.map((value,i)=>({name:D.dimensions[i],value}));
const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
assert.deepEqual(Object.keys(R.profiles).sort(),D.characters.map(c=>c.id).sort());
assert.equal(new Set(Object.values(R.profiles).map(p=>JSON.stringify(p.theme))).size,17);
assert.equal(new Set(Object.values(R.profiles).map(p=>p.similarity)).size,17);
let variants=0;
for(const c of D.characters){
 const p=R.profiles[c.id];
 for(const [key,lo,hi]of [['similarity',200,300],['conflict',150,250],['story',150,200]])assert.ok(p[key].replace(/\s/g,'').length>=lo&&p[key].replace(/\s/g,'').length<=hi,`${c.id} ${key} length`);
 assert.equal(p.axes.length,6);assert.equal(new Set(p.axes).size,6);
 for(const key of ['text','muted','accent','secondary'])for(const bg of ['bg','panel'])assert.ok(contrast(p.theme[key],p.theme[bg])>=4.5,`${c.id} ${key}/${bg} contrast`);
 for(let axis=0;axis<6;axis++){
  const texts=[0,49,50,69,70,100].map(value=>{
   const input=abilities(Array(6).fill(60));input[axis].value=value;
   const snapshot=JSON.stringify(input),report=R.build(c.id,input);assert.equal(JSON.stringify(input),snapshot);assert.equal(report.abilities[axis].value,value);
   const text=report.abilities[axis].text;assert.ok(text.length>=80&&text.length<=120,`${c.id} ${axis}: ${text.length}`);return text;
  });
  assert.equal(texts[0],texts[1]);assert.equal(texts[2],texts[3]);assert.equal(texts[4],texts[5]);assert.equal(new Set(texts).size,3);variants+=3;
 }
 assert.deepEqual(R.build(c.id,abilities([30,49,50,69,70,90])),R.build(c.id,abilities([30,49,50,69,70,90])));
}
for(const bad of [NaN,Infinity,-1,101,'60'])assert.throws(()=>R.band(bad));
assert.throws(()=>R.build('missing',abilities(Array(6).fill(60))));assert.throws(()=>R.build('tanjiro',[]));
// Same matched character, two genuinely reachable answer combinations, differing report readings.
const fixtures=require('../test-results/fixtures.json');let alternate=null,seed=39;
for(let i=0;i<20000&&!alternate;i++){
 const a=D.questions.map(()=>{seed=(1664525*seed+1013904223)>>>0;return seed>>>30}),r=score(D,a),original=score(D,fixtures[r.profile.id]);
 if(r.abilities.some((v,j)=>R.band(v.value)!==R.band(original.abilities[j].value)))alternate={r,original};
}
assert.ok(alternate);assert.equal(alternate.r.profile.id,alternate.original.profile.id);
assert.notDeepEqual(R.build(alternate.r.profile.id,alternate.r.abilities).abilities.map(a=>a.text),R.build(alternate.original.profile.id,alternate.original.abilities).abilities.map(a=>a.text));
console.log(JSON.stringify({status:'passed',characters:17,axisVariants:variants,contrast:'WCAG AA text',sameCharacterScoreVariation:true}));
