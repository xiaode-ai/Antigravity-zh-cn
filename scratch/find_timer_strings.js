import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = {
  'main.js.bak': path.join(outDir, 'jetskiAgent', 'main.js.bak'),
  'workbench.desktop.main.js': path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js'),
  'nls.messages.json': path.join(outDir, 'nls.messages.json')
};

const terms = ['Timed', 'timed', '60 seconds', '60s', 'seconds'];

for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== File: ${name} ===`);
  terms.forEach(term => {
    let idx = 0;
    let count = 0;
    while ((idx = content.indexOf(term, idx)) !== -1) {
      count++;
      if (count <= 10) {
        console.log(`  Found "${term}" at index ${idx}:`);
        console.log(`    Context: ... ${content.substring(Math.max(0, idx - 60), Math.min(content.length, idx + term.length + 80)).replace(/\r?\n/g, ' ')} ...`);
      }
      idx += term.length;
    }
    if (count > 10) {
      console.log(`  ... and ${count - 10} more occurrences of "${term}"`);
    }
  });
}
