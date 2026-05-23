import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

console.log("=== jetskiAgent/main.js ===");
console.log("Active Browser pages index:", mainContent.indexOf("Active Browser pages"));
console.log("活动浏览器页面 index:", mainContent.indexOf("活动浏览器页面"));

console.log("=== vs/workbench/workbench.desktop.main.js ===");
console.log("Active Browser pages index:", wbContent.indexOf("Active Browser pages"));
console.log("活动浏览器页面 index:", wbContent.indexOf("活动浏览器页面"));
