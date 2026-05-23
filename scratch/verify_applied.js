import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbContent = fs.readFileSync(path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js'), 'utf8');
const mainContent = fs.readFileSync(path.join(outDir, 'main.js'), 'utf8');

console.log('--- Checking TAu in vs/workbench/workbench.desktop.main.js ---');
if (wbContent.includes('读取此路径')) {
  console.log('TAu successfully translated!');
  const idx = wbContent.indexOf('读取此路径');
  console.log(wbContent.substring(idx - 10, idx + 100));
} else {
  console.log('TAu translation NOT found!');
}

console.log('\n--- Checking r7a in out/main.js ---');
if (mainContent.includes('读取此路径')) {
  console.log('r7a successfully translated!');
  const idx = mainContent.indexOf('读取此路径');
  console.log(mainContent.substring(idx - 10, idx + 100));
} else {
  console.log('r7a translation NOT found!');
}
