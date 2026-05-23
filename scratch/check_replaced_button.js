import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbCurPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

function check() {
  if (!fs.existsSync(wbCurPath)) {
    console.log('workbench.desktop.main.js not found.');
    return;
  }
  const content = fs.readFileSync(wbCurPath, 'utf8');
  
  // Find where our replacement "查看" or similar was placed
  const index = content.indexOf("查看");
  if (index === -1) {
    console.log('No "查看" found in current workbench file.');
    return;
  }
  
  // Let's print all occurrences of "查看" and their contexts to be sure
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf("查看", idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + 150);
    console.log(`[Match ${count}] Pos: ${idx} | Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    idx += 2;
  }
}

check();
