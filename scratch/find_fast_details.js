import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

const mainContent = fs.readFileSync(mainPath, 'utf8');
const wbContent = fs.readFileSync(wbPath, 'utf8');

function findPatterns(content, name) {
  console.log(`\n=== PATTERNS FOR ${name} ===`);
  const terms = ['"Fast"', "'Fast'", 'children:"Fast"', 'children:\'Fast\'', 'Fast:'];
  terms.forEach(t => {
    let idx = 0;
    while(true) {
      idx = content.indexOf(t, idx);
      if (idx === -1) break;
      console.log(`Match ${t} at index ${idx}:`);
      console.log(`   ...${content.substring(idx - 60, idx + t.length + 60).replace(/\r?\n/g, ' ')}...`);
      idx += t.length;
    }
  });
}

findPatterns(mainContent, 'main.js');
findPatterns(wbContent, 'workbench');
