import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const wbContent = fs.readFileSync(wbPath, 'utf8');

// 打印 Index 14404033 附近的代码
console.log('=== AROUND TERMINAL COUNT (14404033) ===');
const start1 = 14403800;
const end1 = 14404500;
console.log(wbContent.substring(start1, end1));

// 打印 Index 25906195 附近的代码
console.log('\n=== AROUND VIEW ALL SHORTCUTS (25906195) ===');
const start2 = 25906000;
const end2 = 25906400;
console.log(wbContent.substring(start2, end2));
