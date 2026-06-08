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

  content = content.replace(/,\s*\{label:\s*"[^"]*"\}\]\}/g, '');
  content = content.replace(/\]\}\s*/g, ''); 
  // Wait, I shouldn't just replace ]} if it's used elsewhere! 
  // Let's use a smarter regex: `\n        \]\} ` or `, \{label: "..."\}\]\}`
  
  if (content !== original) {
    // wait I will do it differently
  }
});
