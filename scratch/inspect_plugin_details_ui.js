import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const normalWbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const wbFile = fs.existsSync(wbPath) ? wbPath : normalWbPath;
const content = fs.readFileSync(wbFile, 'utf8');

const searchTerms = [
  'openPluginPage',
  'openPluginConfigModal',
  'trustLevel',
  'Official',
  'Reference'
];

searchTerms.forEach(term => {
  let index = 0;
  console.log(`\n\n==================== SEARCHING FOR ${term} ====================`);
  let count = 0;
  while (true) {
    const idx = content.indexOf(term, index);
    if (idx === -1) break;
    count++;
    console.log(`Match #${count} at Index ${idx}:`);
    const start = Math.max(0, idx - 1000);
    const end = Math.min(content.length, idx + term.length + 1000);
    console.log(content.substring(start, end));
    index = idx + term.length;
    if (count >= 5) {
      console.log('... truncated matches');
      break;
    }
  }
});
