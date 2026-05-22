import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

function findBrowserActions(content, name) {
  console.log(`\n=== Browser Actions in ${name} ===`);
  const keywords = ["Typing", "Browser Interaction", "Confirm Browser", "Clicking", "Navigating to"];
  keywords.forEach(keyword => {
    let startIdx = 0;
    while (true) {
      const idx = content.indexOf(keyword, startIdx);
      if (idx === -1) break;
      console.log(`Found "${keyword}" near index ${idx}:\n${content.substring(idx - 100, idx + 150)}`);
      startIdx = idx + 1;
    }
  });
}

findBrowserActions(mainContent, 'main.js');
findBrowserActions(wbContent, 'workbench');
