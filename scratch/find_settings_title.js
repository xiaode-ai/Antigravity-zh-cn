import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  path.join(targetDir, 'jetskiAgent', 'main.js.bak'),
  path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak')
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`\n=== Scanning ${path.basename(filePath)} ===`);
  const content = fs.readFileSync(filePath, 'utf8');

  // Search for Antigravity - Settings
  let idx = content.indexOf('Antigravity - Settings');
  if (idx !== -1) {
    console.log(`Found "Antigravity - Settings" at index ${idx}:`);
    console.log(`  Context: ... ${content.substring(idx - 100, idx + 100).replace(/\r?\n/g, ' ')} ...`);
  } else {
    // Search case insensitive or substring
    idx = content.toLowerCase().indexOf('antigravity - settings');
    if (idx !== -1) {
      console.log(`Found case-insensitive match at index ${idx}:`);
      console.log(`  Context: ... ${content.substring(idx - 100, idx + 100).replace(/\r?\n/g, ' ')} ...`);
    } else {
      console.log('Not found');
    }
  }
});
