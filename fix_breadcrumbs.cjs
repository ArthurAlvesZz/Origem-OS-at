const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/pages', (file) => {
  if (!file.endsWith('.tsx')) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // regex to strip breadcrumbs property
  content = content.replace(/breadcrumbs=\{.*?\}\s*/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Removed breadcrumbs from', file);
  }
});
