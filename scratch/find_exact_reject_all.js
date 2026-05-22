import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

function findExactReject(content, name) {
  console.log(`\n=== Exact Reject in ${name} ===`);
  const phrases = ["Reject all", "Reject All"];
  phrases.forEach(phrase => {
    let startIdx = 0;
    while (true) {
      const idx = content.indexOf(phrase, startIdx);
      if (idx === -1) break;
      console.log(`Found "${phrase}" near index ${idx}:\n${content.substring(idx - 100, idx + 150)}`);
      startIdx = idx + 1;
    }
  });
}

findExactReject(mainContent, 'main.js');
findExactReject(wbContent, 'workbench');
