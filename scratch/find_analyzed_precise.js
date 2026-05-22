import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

const mainContent = fs.readFileSync(mainPath, 'utf8');
const wbContent = fs.readFileSync(wbPath, 'utf8');

function searchAround(content, term, name) {
  console.log(`=== searchAround "${term}" in ${name} ===`);
  let idx = 0;
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    console.log(`Index ${idx}:`);
    console.log(`   ...${content.substring(idx - 100, idx + term.length + 100).replace(/\r?\n/g, ' ')}...`);
    idx += term.length;
  }
}

searchAround(mainContent, '?"Analyzing":"Analyzed"', 'main.js');
searchAround(wbContent, '?"Analyzing":"Analyzed"', 'workbench');

searchAround(mainContent, 'Analyzing content', 'main.js');
searchAround(wbContent, 'Analyzing content', 'workbench');

searchAround(mainContent, 'Analyzing Task Log', 'main.js');
searchAround(wbContent, 'Analyzing Task Log', 'workbench');
