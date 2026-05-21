import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

if (fs.existsSync(wbPath)) {
  const content = fs.readFileSync(wbPath, 'utf8');
  
  const indices = [14962325, 14962631, 14963068];
  
  indices.forEach(idx => {
    console.log(`\nIndex ${idx}:`);
    console.log('--- 30 chars before to 50 chars after ---');
    console.log(content.substring(idx - 30, idx + 50));
    console.log('--- 60 chars before to 80 chars after ---');
    console.log(content.substring(idx - 60, idx + 80));
  });
} else {
  console.log('workbench.desktop.main.js.bak not found');
}
