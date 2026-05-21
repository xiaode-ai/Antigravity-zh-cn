import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') }
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) return;
  const content = fs.readFileSync(f.path, 'utf8');
  let idx = 0;
  let count = 0;
  const term = '"Recording"';
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 80);
    const end = Math.min(content.length, idx + term.length + 80);
    console.log(`[MATCH #${count} in ${f.name}]`);
    console.log(content.substring(start, end).replace(/\r?\n/g, ' '));
    idx += term.length;
  }
});
