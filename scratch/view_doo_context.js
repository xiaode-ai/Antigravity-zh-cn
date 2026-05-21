import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const idx = 14557319;
console.log(`dOo full definition: ${content.substring(idx, idx + 350)}`);
