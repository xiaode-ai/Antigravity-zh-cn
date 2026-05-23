import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const idx = wbContent.indexOf("Screenshot must be under 10 MB");
if (idx !== -1) {
  console.log(`Found Screenshot must be under 10 MB in workbench.desktop.main.js.bak at pos ${idx}:`);
  console.log(wbContent.substring(idx - 150, idx + 200));
} else {
  console.log("Screenshot must be under 10 MB not found in workbench.desktop.main.js.bak");
}
