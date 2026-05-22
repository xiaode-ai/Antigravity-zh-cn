import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') }
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) {
    console.log(`[File Not Found] ${f.name}`);
    return;
  }
  console.log(`\n=== Scanning ${f.name} ===`);
  const content = fs.readFileSync(f.path, 'utf8');

  // Find Tab Speed
  let idx = 0;
  while ((idx = content.indexOf('Tab Speed', idx)) !== -1) {
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + 150);
    console.log(`Found "Tab Speed" at index ${idx}:`);
    console.log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    idx += 'Tab Speed'.length;
  }

  // Find "Tab Speed" description or dropdown values like {label:"Slow" or "Fast"
  idx = 0;
  while ((idx = content.indexOf('Autocomplete Speed', idx)) !== -1) {
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + 150);
    console.log(`Found "Autocomplete Speed" at index ${idx}:`);
    console.log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    idx += 'Autocomplete Speed'.length;
  }
});
