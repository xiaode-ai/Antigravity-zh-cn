import fs from 'fs';
import path from 'path';

const files = [
  { name: 'main.js.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak' },
  { name: 'workbench.desktop.main.js.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak' },
  { name: 'extension.js.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak' },
  { name: 'nls.messages.json.bak', path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak' }
];

const targetTerms = [
  'Agent',
  'Files',
  'Directories',
  'Code Context Items',
  'Limited time',
  'Fast',
  'Open Antigravity IDE User Settings',
  'Quick Settings Panel',
  'Docs',
  'Report Issue',
  'Changelog',
  'Antigravity - Settings',
  'Limited'
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) {
    console.log(`[NOT FOUND] ${f.name} at ${f.path}`);
    return;
  }
  console.log(`\n=================== SEARCHING IN ${f.name} ===================`);
  const content = fs.readFileSync(f.path, 'utf8');

  targetTerms.forEach(term => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      count++;
      
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + term.length + 100);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      console.log(`  [Match #${count}] Term: "${term}" at index ${idx}`);
      console.log(`    Context: ... ${context} ...`);
      
      idx += term.length;
      if (count > 20) {
        console.log(`    ... and more matches skipped ...`);
        break;
      }
    }
  });
});
