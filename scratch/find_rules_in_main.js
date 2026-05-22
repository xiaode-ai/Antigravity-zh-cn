import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.existsSync(mainBakPath) ? fs.readFileSync(mainBakPath, 'utf8') : '';

if (mainContent) {
  const query = 'label:"Rules"';
  let idx = 0;
  while (true) {
    idx = mainContent.indexOf(query, idx);
    if (idx === -1) break;
    console.log(`Found label:"Rules" in main.js.bak at index ${idx}:`);
    console.log(mainContent.substring(idx - 100, idx + 100));
    idx += query.length;
  }
} else {
  console.log('File not found');
}
