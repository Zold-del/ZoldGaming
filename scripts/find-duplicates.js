const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sets = [
  {src: 'js', dst: path.join('public','js')},
  {src: 'css', dst: path.join('public','css')},
  {src: path.join('assets'), dst: path.join('public','assets')}
];

function listFiles(dir){
  const full = path.join(root, dir);
  if(!fs.existsSync(full)) return [];
  const out = [];
  (function walk(d){
    const files = fs.readdirSync(d, { withFileTypes: true });
    for(const f of files){
      const p = path.join(d, f.name);
      if(f.isDirectory()) walk(p);
      else out.push(path.relative(full, p));
    }
  })(full);
  return out;
}

const duplicates = [];
for(const s of sets){
  const a = listFiles(s.src).map(p=>p.replace(/\\/g,'/'));
  const b = listFiles(s.dst).map(p=>p.replace(/\\/g,'/'));
  const bBasenames = new Map();
  for(const p of b){ bBasenames.set(path.basename(p), p); }
  for(const p of a){
    const base = path.basename(p);
    if(bBasenames.has(base)){
      duplicates.push({
        src: path.join(s.src, p).replace(/\\/g,'/'),
        dst: path.join(s.dst, bBasenames.get(base)).replace(/\\/g,'/')
      });
    }
  }
}

// Also include .backup files
const backups = [];
(function findBackups(dir){
  const full = path.join(root, dir);
  if(!fs.existsSync(full)) return;
  const files = fs.readdirSync(full, { withFileTypes: true });
  for(const f of files){
    const p = path.join(full, f.name);
    if(f.isDirectory()) findBackups(path.join(dir, f.name));
    else if(f.name.endsWith('.backup')) backups.push(path.join(dir, f.name).replace(/\\/g,'/'));
  }
})(root);

console.log('DUPLICATES:');
console.log(JSON.stringify(duplicates, null, 2));
console.log('\nBACKUPS:');
console.log(JSON.stringify(backups, null, 2));
