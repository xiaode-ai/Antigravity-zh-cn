import fs from 'fs';
import path from 'path';

const extJsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';

if (!fs.existsSync(extJsPath)) {
  console.log('antigravity/dist/extension.js not found.');
  process.exit(1);
}

const content = fs.readFileSync(extJsPath, 'utf8');

// 匹配包含 limit/Limit 的所有字符串字面量（被单引号、双引号、或模板字面量包裹）
const regex = /(["'`])([^"'`]*?limit[^"'`]*?)\1/gi;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  console.log(`[${count}] Index ${match.index}: QuoteChar: ${match[1]}, String: "${match[2]}"`);
}
