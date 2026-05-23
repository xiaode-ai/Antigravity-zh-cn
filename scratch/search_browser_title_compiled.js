import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

console.log("=== jetskiAgent/main.js ===");
console.log('title:"Browser" index:', mainContent.indexOf('title:"Browser"'));
console.log('title:"浏览器" index:', mainContent.indexOf('title:"浏览器"'));

console.log("=== vs/workbench/workbench.desktop.main.js ===");
console.log('title:"Browser" index:', wbContent.indexOf('title:"Browser"'));
console.log('title:"浏览器" index:', wbContent.indexOf('title:"浏览器"'));
