(function(root){
 'use strict';
 function points(values,cx,cy,radius){return values.map((v,i)=>{const a=-Math.PI/2+i*Math.PI/3;return [cx+Math.cos(a)*radius*v/100,cy+Math.sin(a)*radius*v/100]})}
 const defaultTheme={line:'#3a4b4c',fill:'#edb77d33',accent:'#edb77d',text:'#eee9d9'};
 function render(container,abilities,theme=defaultTheme){
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 440 400');svg.setAttribute('role','img');svg.setAttribute('aria-label','本次冒险六维能力：'+abilities.map(a=>`${a.name}${a.value}`).join('，'));svg.classList.add('ability-radar');
  const make=(tag,attrs)=>{const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));svg.append(n);return n};
  for(const level of [25,50,75,100])make('polygon',{points:points(Array(6).fill(level),220,200,124).map(p=>p.join(',')).join(' '),fill:'none',stroke:theme.line,'stroke-width':1});
  points(Array(6).fill(100),220,200,124).forEach(([x,y])=>make('line',{x1:220,y1:200,x2:x,y2:y,stroke:theme.line}));
  make('polygon',{class:'ability-shape',points:points(abilities.map(a=>a.value),220,200,124).map(p=>p.join(',')).join(' '),fill:theme.fill,stroke:theme.accent,'stroke-width':2});
  const labels=points(Array(6).fill(100),220,200,164);abilities.forEach((a,i)=>{const [x,y]=labels[i],anchor=Math.abs(x-220)<1?'middle':x>220?'start':'end';const label=make('text',{x,y,'text-anchor':anchor,fill:theme.text,'font-size':16});label.textContent=a.name;const value=make('text',{x,y:y+30,'text-anchor':anchor,fill:theme.accent,'font-size':14,class:'ability-score'});value.textContent=String(a.value)});
  container.append(svg);
 }
 function draw(ctx,abilities,cx,cy,radius,theme=defaultTheme){
  const polygon=(p)=>{ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath()};
  ctx.lineWidth=1;ctx.strokeStyle=theme.line;for(const level of [25,50,75,100]){polygon(points(Array(6).fill(level),cx,cy,radius));ctx.stroke()}
  points(Array(6).fill(100),cx,cy,radius).forEach(([x,y])=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke()});polygon(points(abilities.map(a=>a.value),cx,cy,radius));ctx.fillStyle=theme.fill;ctx.fill();ctx.strokeStyle=theme.accent;ctx.lineWidth=3;ctx.stroke();
  const labels=points(Array(6).fill(100),cx,cy,radius+60);abilities.forEach((a,i)=>{const [x,y]=labels[i];ctx.textAlign=Math.abs(x-cx)<1?'center':x>cx?'left':'right';ctx.fillStyle=theme.text;ctx.font='24px sans-serif';ctx.fillText(a.name,x,y);ctx.fillStyle=theme.accent;ctx.font='21px sans-serif';ctx.fillText(String(a.value),x,y+31)});ctx.textAlign='left';
 }
 if(typeof module!=='undefined')module.exports={points};else root.FateRadar={points,render,draw};
})(globalThis);
