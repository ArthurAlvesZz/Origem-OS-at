const fs = require('fs');
const path = require('path');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  // It looks like `title="Comercial & PDV" , {label: "Comercial & PDV"}]}`
  content = content.replace(/title="([^"]+)"\s*,\s*\{label:\s*"[^"]+"\s*\}\]\}/g, 'title="$1"');
  
  // Dashboard case: `\n        \]\} `
  content = content.replace(/title="Command Center"\s*\n\s*\]\}\s*/g, 'title="Command Center"\n');
  content = content.replace(/title="Command Center" \n        \]\} /g, 'title="Command Center"\n');
  fs.writeFileSync(file, content, 'utf8');
}

fs.readdirSync('./src/pages').forEach(f => {
  if (f.endsWith('.tsx')) fix('./src/pages/' + f);
});
