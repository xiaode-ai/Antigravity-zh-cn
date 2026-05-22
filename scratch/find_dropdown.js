import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

function findPatterns(content, name) {
  console.log(`\n=== Patterns in ${name} ===`);
  const idx = content.indexOf('resolveOptionToString:');
  let startIdx = 0;
  while (true) {
    const idx = content.indexOf('return"Fast"', startIdx);
    if (idx === -1) break;
    console.log(`Found near index ${idx}:\n${content.substring(idx - 100, idx + 200)}`);
    startIdx = idx + 1;
  }
}

findPatterns(mainContent, 'main.js');
findPatterns(wbContent, 'workbench');
