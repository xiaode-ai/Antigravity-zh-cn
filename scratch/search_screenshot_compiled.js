import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

console.log("=== jetskiAgent/main.js ===");
console.log('label:"Screenshot" index:', mainContent.indexOf('label:"Screenshot"'));
console.log('label:"Console logs" index:', mainContent.indexOf('label:"Console logs"'));
console.log('label:"截图" index:', mainContent.indexOf('label:"截图"'));
console.log('label:"控制台日志" index:', mainContent.indexOf('label:"控制台日志"'));

console.log("=== vs/workbench/workbench.desktop.main.js ===");
console.log('label:"Screenshot" index:', wbContent.indexOf('label:"Screenshot"'));
console.log('label:"Console logs" index:', wbContent.indexOf('label:"Console logs"'));
console.log('label:"截图" index:', wbContent.indexOf('label:"截图"'));
console.log('label:"控制台日志" index:', wbContent.indexOf('label:"控制台日志"'));
