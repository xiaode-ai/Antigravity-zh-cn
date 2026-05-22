import fs from 'fs';

const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

console.log('workbench near 20530302:');
console.log(wbContent.substring(20530150, 20530750));
