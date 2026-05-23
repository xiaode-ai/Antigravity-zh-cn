import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';

const targets = ["Mention Page", "Capture screenshot"];
targets.forEach(target => {
  const idx = mainContent.indexOf(target);
  if (idx !== -1) {
    console.log(`Found ${target} in main.js.bak at pos ${idx}:`);
    console.log(mainContent.substring(idx - 150, idx + target.length + 150));
  }
});
