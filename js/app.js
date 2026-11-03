(()=>{
 'use strict';
 const D=FateData,app=document.getElementById('app');
 let answers=Array(D.questions.length).fill(null),index=0,result=null,exportUrl=null;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 function button(text,action,cls='btn'){const b=el('button',cls,text);b.type='button';b.onclick=action;return b}
 function view(cls){app.replaceChildren();const s=el('section',cls);app.append(s);window.scrollTo(0,0);app.focus({preventScroll:true});return s}
 function art(){const img=el('img');img.src='assets/night.svg';img.alt='原创月下山谷与灯火，非官方角色画像';img.width=700;img.height=800;return img}
 function home(){
  const s=view('home'),hero=el('div','hero'),copy=el('div');
  copy.append(el('p','eyebrow','鬼灭命运录 / 角色匹配篇'));
  const title=el('h1','','走进鬼灭，');title.append(el('span','','你最像谁？'));
  copy.append(title,el('p','intro','遇见鬼、面对失去、为重要的人做一次决定。看看你的选择，更接近《鬼灭之刃》里的哪位角色。'));
  const opening=el('details','opening');opening.append(el('summary','','这次，你只是小镇上的普通人'),el('p','',D.opening),el('p','',D.instructions));copy.append(opening,button('开始角色测评  ↗',question));
  const meta=el('div','home-meta');['12 道情境题','约 5—8 分钟','12 位角色'].forEach(t=>meta.append(el('span','',t)));copy.append(meta,el('p','micro','含鬼杀队、鬼与反派角色；结果文案涉及人物基本设定。'));
  const figure=el('figure','hero-art');figure.append(art(),el('figcaption','art-caption','不是选阵营 · 是看见你的选择'));hero.append(copy,figure);s.append(hero);
  const preview=el('section','character-preview');preview.append(el('h3','','可能遇见的角色'),el('p','note','阵营不预设，相似之处也不等于你认同角色的全部行为。'));
  const chips=el('div','character-chips');D.characters.forEach(c=>chips.append(el('span','',c.name)));preview.append(chips);s.append(preview);
 }
 function question(){
  const s=view('quiz'),q=D.questions[index],top=el('div','topline');top.append(el('span','','鬼灭命运录 · 角色匹配'),el('span','',`${String(index+1).padStart(2,'0')} / ${D.questions.length}`));
  const prog=el('div','progress');prog.setAttribute('role','progressbar');prog.setAttribute('aria-label','已完成题数');prog.setAttribute('aria-valuemin','0');prog.setAttribute('aria-valuemax',String(D.questions.length));prog.setAttribute('aria-valuenow',String(answers.filter(a=>a!==null).length));const fill=el('span');fill.style.width=`${index/D.questions.length*100}%`;prog.append(fill);
  const title=el('h2','',q.title);title.id='question-title';s.append(top,prog,el('p','question-kicker',`第 ${index+1} 个处境`),title);
  const prose=el('div','question-copy');q.text.split('\n\n').forEach(t=>prose.append(el('p','',t)));s.append(prose);
  const opts=el('div','options');opts.setAttribute('role','group');opts.setAttribute('aria-labelledby','question-title');
  const next=button(index===D.questions.length-1?'揭晓我的角色  ↗':'下一题  →',()=>{if(answers[index]===null)return;if(index===D.questions.length-1){result=FateScore.score(D,answers);report()}else{index++;question()}});next.id='next';next.disabled=answers[index]===null;
  q.options.forEach((o,i)=>{const b=button('',()=>{answers[index]=i;for(const [j,node]of [...opts.children].entries())node.setAttribute('aria-pressed',String(i===j));next.disabled=false},'option');b.setAttribute('aria-pressed',String(answers[index]===i));b.append(el('span','letter',o.id),el('span','',o.text));opts.append(b)});
  const nav=el('div','actions'),back=button('← 上一题',()=>{index--;question()},'btn secondary');back.id='back';back.disabled=index===0;nav.append(back,next);s.append(opts,nav,el('p','micro','各题不一定连续。按第一反应选择，可以返回修改。'));
 }
 function section(parent,n,title){const s=el('section','section'),h=el('div','section-title');h.append(el('span','',n),el('h3','',title));s.append(h);parent.append(s);return s}
 function report(){
  const s=view('result'),p=result.profile;
  const head=el('div','result-head'),copy=el('div');copy.append(el('span','pill',result.tied?'本次并列匹配':result.close?'本次接近的角色之一':'本次选择，更像'),el('h2','',p.name),el('p','verdict',p.verdict),el('p','result-number',`${p.affiliation} / 原创同人解读`));head.append(copy,art());s.append(head);
  if(result.close){const box=el('aside','near-match');box.append(el('strong','',result.tied?`你与${result.runner.name}的匹配也并列。`:`${result.runner.name}也与你很接近。`),el('p','note',result.tied?'本次答案没有分出唯一第一名，页面先展示其中一位。':`两位的支持证据接近。${result.runner.tag}`));s.append(box)}
  s.append(el('p','note','这是12道情境题中的局部相似，不代表你等同于角色，也不判断现实中的善恶、能力或心理状况。'));
  const reason=section(s,'01','为什么是这个角色？');reason.append(el('p','',p.similarity));result.evidence.forEach(e=>{const b=el('div','evidence');b.append(el('b','',`在「${e.question}」里，你选择：`),el('p','',e.answer),el('p','note',e.reason));reason.append(b)});
  const character=section(s,'02',`${p.name}的这个侧面`);character.append(el('p','',p.canon),el('p','note','以上人物信息与下面的性格联想分开呈现；匹配关系属于本产品原创解读。'));
  const difference=section(s,'03','相似，不必走同一条路');difference.append(el('p','',p.difference));
  const reflection=section(s,'04','留给你的一句话');reflection.append(el('p','',p.reflection));
  const actions=el('div','actions');actions.append(button('保存角色卡  ↓',exportCard),button('重新测一次',()=>{answers=Array(D.questions.length).fill(null);index=0;result=null;cleanup();home()},'btn secondary'));s.append(actions);
  const status=el('p','status');status.id='status';status.setAttribute('role','status');s.append(status);
  const details=el('details');details.append(el('summary','','匹配怎么算？'),el('p','','每个选项为若干角色提供不同强度的支持证据。完成后，按各角色在这套题中可获得的分值范围归一化比较，不先分阵营。接近或并列会提示，不展示准确率或百分比。角色池有限，题目也未经过心理测量验证。'),el('p','','反派结果只联想局部动机与行动方式，不认同角色的控制或伤害行为。题库对关系、求证与风险的覆盖较多，对支配欲等特征覆盖有限。'));
  const sources=el('p','note','人物基本信息参考：');D.sources.forEach((source,i)=>{if(i)sources.append(document.createTextNode(' / '));const a=el('a','',source.title);a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a)});details.append(sources);s.append(details);
 }
 function cleanup(){if(exportUrl){URL.revokeObjectURL(exportUrl);exportUrl=null}document.getElementById('card-dialog')?.remove()}
 function wrap(ctx,text,x,y,width,line){let row='';for(const char of text){if(ctx.measureText(row+char).width>width&&row&&!/[，。！？、；：”）》]/.test(char)){ctx.fillText(row,x,y);row=char;y+=line}else row+=char}if(row)ctx.fillText(row,x,y);return y+line}
 async function exportCard(){
  const status=document.getElementById('status');status.textContent='正在绘制你的角色卡…';
  try{
   cleanup();const p=result.profile,canvas=document.createElement('canvas');canvas.width=900;canvas.height=1240;const ctx=canvas.getContext('2d');if(!ctx)throw Error('canvas');
   ctx.fillStyle='#101c22';ctx.fillRect(0,0,900,1240);ctx.strokeStyle='#667167';ctx.strokeRect(34,34,832,1172);
   ctx.fillStyle='#a8b8b5';ctx.font='20px sans-serif';ctx.fillText('平行人生实验室  /  鬼灭命运录',70,95);
   const image=new Image();image.src='assets/night.svg';await image.decode();ctx.drawImage(image,490,140,330,330*800/700);
   ctx.fillStyle='#edb77d';ctx.font='23px sans-serif';ctx.fillText(result.tied?'本次并列匹配':result.close?'本次接近的角色之一':'我的选择，更像',70,195);
   ctx.fillStyle='#eee9d9';ctx.font='52px serif';wrap(ctx,p.name,70,280,395,64);
   ctx.fillStyle='#edb77d';ctx.font='28px serif';wrap(ctx,p.verdict,70,390,380,44);
   ctx.fillStyle='#a8b8b5';ctx.font='20px sans-serif';wrap(ctx,p.affiliation,70,530,385,28);
   ctx.strokeStyle='#3a4b4c';ctx.beginPath();ctx.moveTo(70,610);ctx.lineTo(830,610);ctx.stroke();
   ctx.fillStyle='#edb77d';ctx.font='22px sans-serif';ctx.fillText('相似的地方',70,665);ctx.fillStyle='#eee9d9';ctx.font='25px sans-serif';let y=wrap(ctx,p.similarity,70,718,750,42);
   ctx.fillStyle='#edb77d';ctx.font='22px sans-serif';ctx.fillText('相似，不必走同一条路',70,y+30);ctx.fillStyle='#c5d0c7';ctx.font='24px sans-serif';wrap(ctx,p.difference,70,y+78,750,40);
   ctx.fillStyle='#a8b8b5';ctx.font='19px sans-serif';if(result.close)wrap(ctx,`${result.tied?'并列角色':'也很接近'}：${result.runner.name}。这次并非唯一明确匹配。`,70,1060,750,27);
   ctx.font='18px sans-serif';ctx.fillText('12道情境题 · 局部性格联想，不等同于角色全部行为。',70,1120);ctx.fillText('非官方同人解读，与原作权利方无关联或授权关系。',70,1160);ctx.fillText('非心理诊断；插画为原创场景，不是角色肖像。',70,1190);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('blob');exportUrl=URL.createObjectURL(blob);
   const dialog=el('dialog');dialog.id='card-dialog';dialog.setAttribute('aria-labelledby','card-title');const title=el('h3','','把这次结果带走');title.id='card-title';const img=el('img');img.src=exportUrl;img.alt=`${p.name}角色匹配卡，原创解读`;
   const a=el('a','btn','下载 PNG 角色卡');a.href=exportUrl;a.download=`鬼灭命运录-${p.name}.png`;dialog.append(title,el('p','note','点击下载；手机也可长按图片保存。'),img,a,button('关闭预览',()=>dialog.close(),'btn secondary'));document.body.append(dialog);dialog.showModal();status.textContent='角色卡已生成，可下载或长按保存。';
  }catch{status.textContent='图片生成失败，请稍后重试。你也可以截图保存结果。'}
 }
 home();
})();
