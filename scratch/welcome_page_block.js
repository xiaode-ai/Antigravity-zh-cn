import fs from 'fs';

const filePath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak";
const content = fs.readFileSync(filePath, 'utf8');

const pos = 14620710; // Match 1 的位置
const start = Math.max(0, pos - 1000);
const end = Math.min(content.length, pos + 2500);

console.log("--- START CONTEXT ---");
console.log(content.substring(start, end));
console.log("--- END CONTEXT ---");
