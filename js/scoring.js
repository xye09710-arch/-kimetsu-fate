(function(root){
  function score(data,answers){
    if(!Array.isArray(answers)||answers.length!==data.questions.length)throw new Error('请完成全部题目');
    const picks=answers.map((a,i)=>{if(!Number.isInteger(a)||!data.questions[i].options[a])throw new Error('存在无效答案');return data.questions[i].options[a]});
    const factionScore=picks.reduce((sum,o)=>sum+o.faction,0);
    // Ties use the last unequal piece of faction evidence, never random assignment.
    const faction=factionScore>0?'slayer':factionScore<0?'demon':picks[picks.length-1].faction>0?'slayer':'demon';
    const traits=data.dimensions.map((_,i)=>picks.filter(o=>o.trait===i).length);
    const max=Math.max(...traits);
    const trait=[...picks].reverse().find(o=>traits[o.trait]===max).trait;
    const profile=data.profiles.find(p=>p.faction===faction&&p.trait===trait);
    const evidence=picks.map((o,i)=>({question:data.questions[i].title,answer:o.text,trait:o.trait,index:i})).filter(o=>o.trait===trait).slice(-2);
    return {faction,factionScore,traits,trait,profile,evidence,close:Math.abs(factionScore)<=3};
  }
  if(typeof module!=='undefined')module.exports={score};else root.FateScore={score};
})(typeof globalThis!=='undefined'?globalThis:this);
