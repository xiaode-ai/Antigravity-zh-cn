import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') },
  { name: 'nls.messages.json.bak', path: path.join(targetDir, 'nls.messages.json.bak') }
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) {
    console.log(`[File Not Found] ${f.name}`);
    return;
  }
  const content = fs.readFileSync(f.path, 'utf8');
  let idx = 0;
  let count = 0;
  const term = 'limited time';
  while (true) {
    idx = content.toLowerCase().indexOf(term, idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + term.length + 100);
    console.log(`[MATCH #${count} in ${f.name}] Index: ${idx}`);
    console.log(content.substring(start, end));
    idx += term.length;
  }
  if (count === 0) {
    console.log(`No match for "limited time" in ${f.name}`);
  }
});
