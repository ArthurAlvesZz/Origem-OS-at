const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (file) => {
  if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
  let content = fs.readFileSync(file, 'utf8');
  let initialContent = content;

  content = content.replace(/catch\((\w+):\s*any\)\s*\{\s*console\.error\(\1\.split\('\:'\)\[0\]\.trim\(\)\);\s*console\.error\("Unhandled error"\);\s*\}/g, 'catch($1: any) { console.error($1); }');
  
  if (content !== initialContent) {
     fs.writeFileSync(file, content, 'utf8');
     console.log('Fixed:', file);
  }
});
