import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const idx = 9785471;
// Search backwards for the function definition
const startIdx = content.lastIndexOf('const ', idx);
console.log(`Context before: ${content.substring(startIdx, idx)}`);
