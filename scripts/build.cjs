const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');fs.mkdirSync(out,{recursive:true});
for(const file of ['index.html','css/style.css','js/data.js','js/scoring.js','js/app.js','js/radar.js','assets/night.svg']){const dest=path.join(out,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,file),dest)}
console.log('Static publish directory: '+out);
