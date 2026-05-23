import fs from 'fs';
import path from 'path';

const files = [
  {
    name: 'main.js',
    path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak'
  },
  {
    name: 'workbench.js',
    path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
  },
  {
    name: 'extension.js',
    path: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak'
  }
];

const targets = [
  'Recording',
  'background processes',
  'Browser',
  'Search all convos',
  'Current',
  'more...',
  'to navigate',
  'to select',
  'Ran'
];

files.forEach(fileInfo => {
  if (!fs.existsSync(fileInfo.path)) {
    console.log(`[WARN] File not found: ${fileInfo.path}`);
    return;
  }
  
  console.log(`\n================== Scanning ${fileInfo.name} ==================`);
  const content = fs.readFileSync(fileInfo.path, 'utf8');
  
  targets.forEach(target => {
    let idx = 0;
    let foundCount = 0;
    while (true) {
      idx = content.indexOf(target, idx);
      if (idx === -1) break;
      
      foundCount++;
      if (foundCount <= 10) { // Limit output per term per file
        const start = Math.max(0, idx - 80);
        const end = Math.min(content.length, idx + target.length + 80);
        console.log(`[${target}] Pos ${idx}: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
      }
      idx += target.length;
    }
    if (foundCount > 10) {
      console.log(`[${target}] ... and ${foundCount - 10} more matches.`);
    }
  });
});
