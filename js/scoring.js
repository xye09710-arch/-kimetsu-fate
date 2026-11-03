(function(root){
 'use strict';
 function score(data,answers){
  if(!Array.isArray(answers)||answers.length!==data.questions.length)throw Error('请完成全部题目');
  const picks=data.questions.map((q,i)=>{const a=answers[i];if(!Number.isInteger(a)||a<0||a>=q.options.length)throw Error('存在无效答案');return q.options[a]});
  // Normalize against each character's own theoretical score range across all questions.
  // Scores are editorial support, never probabilities or population percentiles.
  const ranking=data.characters.map(character=>{const id=character.id;let raw=0,min=0,max=0;
   data.questions.forEach((q,i)=>{const values=q.options.map(o=>o.support[id]||0);min+=Math.min(...values);max+=Math.max(...values);raw+=picks[i].support[id]||0});
   if(max===min)throw Error('角色缺少区分证据：'+id);
   return {character,raw,min,max,value:(raw-min)/(max-min)};
  }).sort((a,b)=>b.value-a.value||a.character.id.localeCompare(b.character.id,'en'));
  const best=ranking[0],runner=ranking[1],gap=best.value-runner.value;
  const evidence=data.questions.map((q,i)=>({question:q.title,questionId:q.id,answer:picks[i].text,reason:picks[i].reason,points:picks[i].support[best.character.id]||0,index:i})).filter(e=>e.points>0).sort((a,b)=>b.points-a.points||a.index-b.index).slice(0,3);
  return {profile:best.character,runner:runner.character,ranking,evidence,close:gap<0.04,tied:Math.abs(gap)<1e-12,gap};
 }
 if(typeof module!=='undefined')module.exports={score};else root.FateScore={score};
})(globalThis);
