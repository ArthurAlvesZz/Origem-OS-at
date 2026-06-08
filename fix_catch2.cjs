const fs = require('fs');
const glob = require('glob');
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
  let initial = content;
  content = content.replace(/catch\s*\(\s*e\s*\)\s*\{/g, 'catch(e: any) {');
  content = content.replace(/catch\s*\(\s*err\s*\)\s*\{/g, 'catch(err: any) {');
  content = content.replace(/catch\s*\(\s*error\s*\)\s*\{/g, 'catch(error: any) {');
  // and the ones already with console.error(e) 
  if(content !== initial) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
