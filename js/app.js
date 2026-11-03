(()=>{
 'use strict';
 const D=FateData,app=document.getElementById('app');
 let answers=Array(D.questions.length).fill(null),index=0,result=null,exportUrl=null;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 function button(text,action,cls='btn'){const b=el('button',cls,text);b.type='button';b.onclick=action;return b}
 function view(cls){app.replaceChildren();const s=el('section',cls);app.append(s);window.scrollTo(0,0);app.focus({preventScroll:true});return s}
 function art(){const img=el('img');img.src='assets/wisteria-night.png';img.alt='原创紫藤花与雾林石阶，佩刀旅人背影，非官方角色画像';img.width=700;img.height=800;return img}
 function characterPortrait(character){const img=el('img','result-portrait');img.src=character.portrait;img.alt=character.name+'战斗正面同人肖像';img.width=700;img.height=800;img.decoding='async';img.onerror=()=>{img.hidden=true;const message=el('p','portrait-error',character.name+'的肖像暂时加载失败，请刷新重试。');message.setAttribute('role','status');img.after(message)};return img}
 function home(){
  const s=view('home'),hero=el('div','hero'),copy=el('div');
  copy.append(el('p','eyebrow','鬼灭命运录 / 角色匹配篇'));
  const title=el('h1','','走进鬼灭，');title.append(el('span','','你最像谁？'));
  copy.append(title,el('p','intro','遇见鬼、面对失去、为重要的人做一次决定。看看你的选择，更接近《鬼灭之刃》里的哪位角色。'));
  const opening=el('details','opening');opening.append(el('summary','','这次，你只是小镇上的普通人'),el('p','',D.opening),el('p','',D.instructions));copy.append(opening,button('开始角色测评  ↗',question));
  const meta=el('div','home-meta');['16 道情境题','约 6—10 分钟','16 位角色 + 隐藏彩蛋'].forEach(t=>meta.append(el('span','',t)));copy.append(meta,el('p','micro','含鬼杀队、鬼与反派角色；结果文案涉及人物基本设定。'));
  const figure=el('figure','hero-art');figure.append(art(),el('figcaption','art-caption','十六次选择 · 你的鬼灭角色'));hero.append(copy,figure);s.append(hero);
  const preview=el('section','character-preview');preview.append(el('h3','','可能遇见的角色'),el('p','note','阵营不预设，相似之处也不等于你认同角色的全部行为。'));
  const chips=el('div','character-chips');D.characters.filter(c=>c.id!==D.hidden.id).forEach(c=>chips.append(el('span','',c.name)));chips.append(el('span','hidden-chip','？ 隐藏角色'));preview.append(chips,el('p','note','完成答题后另有独立彩蛋机会：每次 0.1%。与答案匹配无关；不加收费用，不代表人格稀有度。'));s.append(preview);
 }
 function question(){
  const s=view('quiz'),q=D.questions[index],top=el('div','topline');top.append(el('span','','鬼灭命运录 · 角色匹配'),el('span','',`${String(index+1).padStart(2,'0')} / ${D.questions.length}`));
  const prog=el('div','progress');prog.setAttribute('role','progressbar');prog.setAttribute('aria-label','已完成题数');prog.setAttribute('aria-valuemin','0');prog.setAttribute('aria-valuemax',String(D.questions.length));prog.setAttribute('aria-valuenow',String(answers.filter(a=>a!==null).length));const fill=el('span');fill.style.width=`${index/D.questions.length*100}%`;prog.append(fill);
  const title=el('h2','',q.title);title.id='question-title';s.append(top,prog,el('p','question-kicker',`第 ${index+1} 个处境`),title);
  const prose=el('div','question-copy');q.text.split('\n\n').forEach(t=>prose.append(el('p','',t)));s.append(prose);
  const opts=el('div','options');opts.setAttribute('role','group');opts.setAttribute('aria-labelledby','question-title');
  const next=button(index===D.questions.length-1?'揭晓我的角色  ↗':'下一题  →',()=>{if(answers[index]===null)return;if(index===D.questions.length-1){try{result=FateScore.resolve(D,answers,FateScore.roll(globalThis.crypto,D.hidden.oneIn));report()}catch{let notice=document.getElementById('quiz-error');if(!notice){notice=el('p','status');notice.id='quiz-error';notice.setAttribute('role','status');s.append(notice)}notice.textContent='暂时无法生成结果，请稍后重试。'}}else{index++;question()}});next.id='next';next.disabled=answers[index]===null;
  q.options.forEach((o,i)=>{const b=button('',()=>{answers[index]=i;for(const [j,node]of [...opts.children].entries())node.setAttribute('aria-pressed',String(i===j));next.disabled=false},'option');b.setAttribute('aria-pressed',String(answers[index]===i));b.append(el('span','letter',o.id),el('span','',o.text));opts.append(b)});
  const nav=el('div','actions'),back=button('← 上一题',()=>{index--;question()},'btn secondary');back.id='back';back.disabled=index===0;nav.append(back,next);s.append(opts,nav,el('p','micro','各题不一定连续。按第一反应选择，可以返回修改。'));
 }
 function section(parent,n,title){const s=el('section','section'),h=el('div','section-title');h.append(el('span','',n),el('h3','',title));s.append(h);parent.append(s);return s}
 function theme(node,t){for(const [key,value]of Object.entries(t))node.style.setProperty('--'+({accent:'gold',secondary:'green'}[key]||key),value)}
 function prose(parent,text){text.split('\n\n').forEach(part=>parent.append(el('p','',part)))}
 function report(){
  const s=view(result.hidden?'result hidden-result':'result'),p=result.profile,r=FateReport.build(p.id,result.abilities);s.dataset.character=p.id;theme(s,r.theme);
  const head=el('div','result-head'),copy=el('div');copy.append(el('span','pill',result.hidden?'隐藏彩蛋 · 偶然相逢':result.tied?'本次并列匹配':result.close?'本次接近的角色之一':'本次选择，更像'),el('h2','',p.name),el('p','verdict',p.verdict),el('p','result-number',`${p.affiliation} / 原创同人解读`));head.append(copy,characterPortrait(p));s.append(head);
  if(!result.hidden&&result.close){const box=el('aside','near-match');box.append(el('strong','',result.tied?`你与${result.runner.name}的匹配也并列。`:`${result.runner.name}也与你很接近。`),el('p','note',result.tied?'你身上，也有另一位角色的影子。':`${result.runner.tag}`));s.append(box)}
  if(result.hidden){const banner=el('aside','hidden-banner');banner.append(el('p','eyebrow','HIDDEN ENCOUNTER'),el('h3','','你遇见了一位没有写在名单上的人。'),el('p','note','本次独立彩蛋触发率为 0.1%，不是答题匹配出的稀有人格。你的常规匹配仍然保留。'));s.append(banner)}
  const ability=section(s,'01','你的六维能力');const chart=el('div','ability-chart');chart.id='ability-chart';FateRadar.render(chart,result.abilities,r.theme);ability.append(chart,el('p','note','本次冒险的六维侧重，仅作娱乐叙事参考。'));
  const readings=el('div','ability-readings');r.abilities.forEach(a=>{const item=el('article','ability-reading');item.dataset.band=a.band;item.append(el('h4','',`${a.name} · ${a.value}`),el('p','',a.text));readings.append(item)});ability.append(readings);
  if(result.hidden){const regular=el('p','note','本次常规角色：');regular.append(el('strong','regular-match',result.regularProfile.name));ability.append(regular)}
  const portrait=section(s,'02','与角色的相似之处');prose(portrait,r.similarity);
  const conflict=section(s,'03','角色的内在矛盾');prose(conflict,r.conflict);
  const story=section(s,'04','如果生活在鬼灭世界');story.append(el('p','note story-label','原创情境 · 非原作剧情'));prose(story,r.story);
  const reflection=section(s,'05','留给你的一句话');reflection.append(el('p','',p.reflection));
  const actions=el('div','actions');actions.append(button('保存角色卡  ↓',exportCard),button('重新测一次',()=>{answers=Array(D.questions.length).fill(null);index=0;result=null;cleanup();home()},'btn secondary'));s.append(actions);
  const status=el('p','status');status.id='status';status.setAttribute('role','status');s.append(status);

 }
 function cleanup(){if(exportUrl){URL.revokeObjectURL(exportUrl);exportUrl=null}document.getElementById('card-dialog')?.remove()}
 // Text is confined to explicit card regions; even longer future copy is ellipsized.
 function wrap(ctx,text,x,y,width,line,maxLines){
  const rows=[];let row='';
  for(const char of text){if(row&&ctx.measureText(row+char).width>width){rows.push(row);row=''}row+=char}if(row)rows.push(row);
  if(rows.length>maxLines){rows.length=maxLines;let last=rows[maxLines-1];while(last&&ctx.measureText(last+'…').width>width)last=last.slice(0,-1);rows[maxLines-1]=last+'…'}
  rows.forEach((row,i)=>ctx.fillText(row,x,y+i*line));return y+rows.length*line;
 }
 async function exportCard(){
  const status=document.getElementById('status');status.textContent='正在绘制你的角色卡…';
  try{
   cleanup();const p=result.profile,t=FateReport.profiles[p.id].theme,canvas=document.createElement('canvas');canvas.width=900;canvas.height=1600;const ctx=canvas.getContext('2d');if(!ctx)throw Error('canvas');
   const gradient=ctx.createLinearGradient(0,0,900,1600);gradient.addColorStop(0,t.panel);gradient.addColorStop(1,t.bg);ctx.fillStyle=gradient;ctx.fillRect(0,0,900,1600);ctx.strokeStyle=t.secondary;ctx.strokeRect(34,34,832,1532);
   ctx.fillStyle=t.muted;ctx.font='20px sans-serif';ctx.fillText('平行人生实验室  /  鬼灭命运录',70,95);
   const image=new Image();image.src=p.portrait;try{await image.decode();ctx.drawImage(image,490,140,330,330*image.naturalHeight/image.naturalWidth)}catch{ctx.fillStyle=t.panel;ctx.fillRect(490,140,330,380);ctx.fillStyle=t.accent;ctx.font='24px serif';wrap(ctx,p.name+' · 肖像暂缺',520,300,270,38,3)}
   ctx.fillStyle=t.accent;ctx.font='23px sans-serif';ctx.fillText(result.hidden?'隐藏彩蛋 · 偶然相逢':result.tied?'本次并列匹配':result.close?'本次接近的角色之一':'我的选择，更像',70,195);
   ctx.fillStyle=t.text;ctx.font='52px serif';wrap(ctx,p.name,70,280,395,64,2);
   ctx.fillStyle=t.accent;ctx.font='28px serif';wrap(ctx,p.verdict,70,430,380,44,2);
   ctx.fillStyle=t.muted;ctx.font='20px sans-serif';wrap(ctx,p.affiliation,70,550,385,28,2);
   ctx.strokeStyle=t.line;ctx.beginPath();ctx.moveTo(70,610);ctx.lineTo(830,610);ctx.stroke();
   ctx.fillStyle=t.accent;ctx.font='22px sans-serif';ctx.fillText('你的六维能力',70,665);FateRadar.draw(ctx,result.abilities,450,925,160,t);
   ctx.fillStyle=t.accent;ctx.font='22px sans-serif';ctx.fillText(result.hidden?'这次特别的相逢':'你的鬼灭侧写',70,1225);ctx.fillStyle=t.text;ctx.font='24px sans-serif';wrap(ctx,p.similarity,70,1270,750,40,3);
   ctx.fillStyle=t.muted;ctx.font='19px sans-serif';if(result.hidden)wrap(ctx,`独立彩蛋 0.1% · 常规角色：${result.regularProfile.name}`,70,1440,750,27,2);else if(result.close)wrap(ctx,`${result.tied?'并列角色':'也很接近'}：${result.runner.name}`,70,1440,750,27,2);
   ctx.font='18px sans-serif';ctx.fillText('鬼灭命运录 · 十六次选择，一张属于你的角色卡。',70,1500);ctx.fillText('非官方同人创作，与原作权利方无关联或授权关系。',70,1540);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('blob');exportUrl=URL.createObjectURL(blob);
   const dialog=el('dialog');theme(dialog,t);dialog.dataset.character=p.id;dialog.id='card-dialog';dialog.setAttribute('aria-labelledby','card-title');const title=el('h3','','把这次结果带走');title.id='card-title';const img=el('img');img.src=exportUrl;img.alt=`${p.name}角色匹配卡，原创解读`;
   const a=el('a','btn','下载 PNG 角色卡');a.href=exportUrl;a.download=`鬼灭命运录-${p.name}.png`;dialog.append(title,el('p','note','点击下载；手机也可长按图片保存。'),img,a,button('关闭预览',()=>dialog.close(),'btn secondary'));document.body.append(dialog);dialog.showModal();status.textContent='角色卡已生成，可下载或长按保存。';
  }catch{status.textContent='图片生成失败，请稍后重试。你也可以截图保存结果。'}
 }
 home();
})();
