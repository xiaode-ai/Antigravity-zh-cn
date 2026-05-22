import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'jetskiAgent', 'main.js.bak'), term: 'settings-button' },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak'), term: 'settings-button' }
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) return;
  console.log(`\n=== Scanning ${f.name} ===`);
  const content = fs.readFileSync(f.path, 'utf8');
  let idx = content.indexOf(f.term);
  if (idx !== -1) {
    console.log(`Found "${f.term}" at index ${idx}`);
    console.log('Context (250 chars before and 50 chars after):');
    console.log(content.substring(idx - 250, idx + 50));
  } else {
    console.log(`"${f.term}" not found`);
  }
});
