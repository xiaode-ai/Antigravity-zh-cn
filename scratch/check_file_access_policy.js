import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const mainContent = fs.readFileSync(mainPath, 'utf8');

const term = 'Outside of folders file access policy';
let idx = mainContent.indexOf(term);
if (idx === -1) {
  // Try Chinese translation of it: "工作文件夹外的文件访问策略"
  idx = mainContent.indexOf('工作文件夹外的文件访问策略');
}
if (idx !== -1) {
  console.log(`Found file access policy at index ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 650));
} else {
  console.log('File access policy setting not found');
}
