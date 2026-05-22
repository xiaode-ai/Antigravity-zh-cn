import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainBakPath) ? fs.readFileSync(mainBakPath, 'utf8') : '';
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

function findSnooze(content, name) {
  if (!content) return;
  console.log(`=== Snooze in ${name} ===`);
  const keywords = ['"Snooze"', 'textContent="Snooze"', 'Snoozed for'];
  keywords.forEach(keyword => {
    let idx = 0;
    while (true) {
      idx = content.indexOf(keyword, idx);
      if (idx === -1) break;
      console.log(`Found "${keyword}" near index ${idx}:`);
      console.log(content.substring(idx - 150, idx + 150));
      idx += keyword.length;
    }
  });
}

findSnooze(mainContent, 'main.js.bak');
findSnooze(wbContent, 'workbench.desktop.main.js.bak');
