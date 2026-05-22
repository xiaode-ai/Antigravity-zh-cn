import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

if (fs.existsSync(mainPath)) {
  const content = fs.readFileSync(mainPath, 'utf8');
  const regex = /limit/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const idx = match.index;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + match[0].length + 100);
    const context = content.substring(start, end).replace(/\r?\n/g, ' ');
    if (context.toLowerCase().includes('time')) {
      console.log(`[FOUND in jetskiAgent] Index: ${idx}`);
      console.log(`  Context: ... ${context} ...\n`);
    }
  }
}
