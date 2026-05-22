import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

const mainContent = fs.readFileSync(mainPath, 'utf8');
const wbContent = fs.readFileSync(wbPath, 'utf8');

function findRanContext(content, name) {
  console.log(`=== RAN PATTERNS IN ${name} ===`);
  const patterns = ['"Ran"', '"Running"', '"Canceled"', '"Canceled running of"', 'case"command":'];
  patterns.forEach(pat => {
    let idx = 0;
    while(true) {
      idx = content.indexOf(pat, idx);
      if (idx === -1) break;
      console.log(`Pattern ${pat} at index ${idx}:`);
      console.log(`   ...${content.substring(idx - 80, idx + pat.length + 80).replace(/\r?\n/g, ' ')}...`);
      idx += pat.length;
    }
  });
}

findRanContext(mainContent, 'main.js');
findRanContext(wbContent, 'workbench');
