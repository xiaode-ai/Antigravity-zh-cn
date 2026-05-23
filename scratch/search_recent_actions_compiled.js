import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

console.log("=== jetskiAgent/main.js ===");
console.log('children:"Recent actions" index:', mainContent.indexOf('children:"Recent actions"'));
console.log('children:"最近操作" index:', mainContent.indexOf('children:"最近操作"'));

console.log("=== vs/workbench/workbench.desktop.main.js ===");
console.log('children:"Recent actions" index:', wbContent.indexOf('children:"Recent actions"'));
console.log('children:"最近操作" index:', wbContent.indexOf('children:"最近操作"'));
