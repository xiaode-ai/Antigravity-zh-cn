import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

console.log("=== jetskiAgent/main.js ===");
console.log("Working directory index:", mainContent.indexOf("Working directory:"));
console.log("工作目录 index:", mainContent.indexOf("工作目录:"));

console.log("=== vs/workbench/workbench.desktop.main.js ===");
console.log("Working directory index:", wbContent.indexOf("Working directory:"));
console.log("工作目录 index:", wbContent.indexOf("工作目录:"));
