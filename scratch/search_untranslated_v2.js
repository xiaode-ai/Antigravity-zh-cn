import fs from 'fs';
import path from 'path';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const wbBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const nlsBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';

const files = [
  { name: 'main.js', path: mainBakPath },
  { name: 'workbench.desktop.main.js', path: wbBakPath },
  { name: 'nls.messages.json', path: nlsBakPath }
];

const targets = [
  'Recording...',
  'Terminal',
  'background processes',
  'Browser',
  'Search all convos',
  'Current',
  'Show ',
  'to navigate',
  'to select',
  'Ran'
];

targets.forEach(t => {
  console.log(`\n================ Searching for: "${t}" ================`);
  files.forEach(f => {
    if (!fs.existsSync(f.path)) {
      console.log(`File not found: ${f.name}`);
      return;
    }
    const content = fs.readFileSync(f.path, 'utf8');
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(t, idx);
      if (idx === -1) break;
      count++;
      // Print context
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + t.length + 100);
      console.log(`[${f.name}] Match ${count} at ${idx}:`);
      console.log(`  ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
      idx += t.length;
      if (count >= 10) {
        console.log(`[${f.name}] Truncated matches (>= 10 found)`);
        break;
      }
    }
  });
});
