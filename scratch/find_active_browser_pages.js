import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';

const idx = mainContent.indexOf("Active Browser pages");
if (idx !== -1) {
  console.log(`Found Active Browser pages at pos ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 200));
} else {
  console.log("Active Browser pages not found in main.js.bak");
}
