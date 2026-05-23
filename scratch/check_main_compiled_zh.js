import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';

const idx = mainContent.indexOf("工作目录");
if (idx !== -1) {
  console.log(`Found 工作目录 in jetskiAgent/main.js at pos ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 200));
} else {
  console.log("工作目录 not found in jetskiAgent/main.js");
}
