import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

function findTerminalTooltip(content, name) {
  console.log(`\n=== Terminal Tooltip in ${name} ===`);
  let startIdx = 0;
  while (true) {
    const idx = content.indexOf('id:"terminal"', startIdx);
    if (idx === -1) break;
    console.log(`Found near index ${idx}:\n${content.substring(idx - 100, idx + 150)}`);
    startIdx = idx + 1;
  }
}

findTerminalTooltip(mainContent, 'main.js');
findTerminalTooltip(wbContent, 'workbench');
