import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';

const files = [
  path.join(targetDir, 'jetskiAgent', 'main.js.bak'),
  path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak'),
  path.join(targetDir, 'nls.messages.json.bak')
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`Searching: ${path.basename(filePath)}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find index of 'Toggle Agent' case insensitively
  let idx = 0;
  while (true) {
    idx = content.toLowerCase().indexOf('toggle agent', idx);
    if (idx === -1) break;
    console.log(`  Found at index ${idx}: "${content.substring(idx - 50, idx + 80).replace(/\r?\n/g, ' ')}"`);
    idx += 12;
  }
});
