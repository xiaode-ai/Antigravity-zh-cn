import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

if (fs.existsSync(mainPath)) {
  const content = fs.readFileSync(mainPath, 'utf8');
  let idx = 0;
  let count = 0;
  const term = 'time';
  while (true) {
    idx = content.toLowerCase().indexOf(term, idx);
    if (idx === -1) break;
    
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + term.length + 100);
    const snippet = content.substring(start, end).toLowerCase();
    
    if (snippet.includes('limit')) {
      count++;
      console.log(`[MATCH #${count}] Index: ${idx}`);
      console.log(content.substring(start, end).replace(/\r?\n/g, ' '));
    }
    
    idx += term.length;
  }
} else {
  console.log('jetskiAgent/main.js.bak not found');
}
