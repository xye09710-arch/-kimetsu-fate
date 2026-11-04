const fs=require('node:fs'),D=require('../js/data.js');
fs.mkdirSync('docs',{recursive:true});
const questions=['# 确认题目 · v0.4','',D.opening,'',D.instructions,''];
for(const q of D.questions){questions.push(`## ${q.id}｜${q.title}`,'',q.text,'',...q.options.map(o=>`${o.id}. ${o.text}`),'')}
fs.writeFileSync('docs/QUESTIONS.md',questions.join('\n'));
const scoring=['# 角色支持映射 · v0.4','','此表由js/data.js生成。3/2/1是编辑支持强度，其他角色为0；不代表官方人物会做出的答案。算法与局限见PRODUCT.md。','', '|角色ID|角色|归属|理论最低总分|理论最高总分|','|---|---|---|---:|---:|'];
for(const c of D.characters.filter(c=>c.id!==D.hidden.id)){let min=0,max=0;for(const q of D.questions){const v=q.options.map(o=>o.support[c.id]||0);min+=Math.min(...v);max+=Math.max(...v)}scoring.push(`|${c.id}|${c.name}|${c.affiliation}|${min}|${max}|`)}
for(const q of D.questions){scoring.push('',`## ${q.id}｜${q.title}`,'','|选项原文|支持分|动作解释|六维能力输入|','|---|---|---|---|');for(const o of q.options){const support=Object.entries(o.support).map(([id,n])=>`${D.characters.find(c=>c.id===id).name} ${n}`).join('；');scoring.push(`|${o.id}. ${o.text}|${support}|${o.reason}|${o.ability.join(" / ")}|`)}}
scoring.push('','## 六维能力','',D.dimensions.join(' / '),'每题各维度按该题选项最小—最大值归一化，再平均映射到30—90；同题同分不参与该维度。不是固定角色属性。页面和PNG共享几何点位算法。','','## 隐藏彩蛋','', '继国缘一不参与答题评分。每次完成题目，独立触发概率为1/1000（0.1%）；不加收费用。触发后显示常规角色，支持证据仅内部保留、不在结果页显示。概率不代表性格稀有度，也不保证某一批真实用户的频数排序。');fs.writeFileSync('docs/SCORING.md',scoring.join('\n')+'\n');console.log('Exported confirmed questions and complete 64-option support map.');
