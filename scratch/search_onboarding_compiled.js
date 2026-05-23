import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

console.log("=== jetskiAgent/main.js ===");
console.log("Onboarding text index:", mainContent.indexOf("Pages currently open in Antigravity's Browser instance are shown below."));
console.log("Onboarding translated index:", mainContent.indexOf("以下显示了当前在 Antigravity 浏览器实例中打开的页面。"));

console.log("=== vs/workbench/workbench.desktop.main.js ===");
console.log("Onboarding text index:", wbContent.indexOf("Pages currently open in Antigravity's Browser instance are shown below."));
console.log("Onboarding translated index:", wbContent.indexOf("以下显示了当前在 Antigravity 浏览器实例中打开的页面。"));
