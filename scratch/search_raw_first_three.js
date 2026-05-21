import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

if (!fs.existsSync(wbPath)) {
  console.log(`[File Not Found] ${wbPath}`);
  process.exit(1);
}

const content = fs.readFileSync(wbPath, 'utf8');
const searchTerms = [
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)'
];

searchTerms.forEach(term => {
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + term.length + 100);
    console.log(`[MATCH #${count} for "${term}"] Index: ${idx}`);
    console.log(content.substring(start, end).replace(/\r?\n/g, ' '));
    idx += term.length;
  }
});
