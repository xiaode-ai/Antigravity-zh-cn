import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

function searchUI(filePath, name) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /["']Agent["']/g;
  let match;
  let count = 0;
  console.log(`\n=== Matches for "Agent" (quoted) in ${name} ===`);
  while ((match = regex.exec(content)) !== null) {
    count++;
    const idx = match.index;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + match[0].length + 100);
    const context = content.substring(start, end).replace(/\r?\n/g, ' ');
    
    // 我们主要关注类似 label, text, children, title, displayName 等前缀
    if (context.includes('label') || context.includes('text') || context.includes('children') || context.includes('title') || context.includes('displayName') || context.includes('name') || context.includes('tooltip')) {
      console.log(`[${count}] Index ${idx}:`);
      console.log(`  Context: ${context}\n`);
    }
  }
}

searchUI(mainPath, 'jetskiAgent/main.js.bak');
searchUI(wbPath, 'workbench.desktop.main.js.bak');
