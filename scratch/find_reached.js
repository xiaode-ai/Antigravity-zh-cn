import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

function findReached(content, name) {
  console.log(`\n=== "reached" in ${name} ===`);
  let startIdx = 0;
  let count = 0;
  while (true) {
    const idx = content.toLowerCase().indexOf('reached', startIdx);
    if (idx === -1) break;
    count++;
    console.log(`Match ${count} at index ${idx}:`);
    console.log(`  ...${content.substring(idx - 100, idx + 100).replace(/\n/g, ' ')}...`);
    startIdx = idx + 1;
  }
}

findReached(mainContent, 'main.js');
findReached(wbContent, 'workbench');
