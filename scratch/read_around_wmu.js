import fs from 'fs';
const content = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

const start = 13940000;
const end = 13943700;
fs.writeFileSync('scratch/around_wmu.js', content.substring(start, end));
console.log(`Saved substring from ${start} to ${end} to scratch/around_wmu.js`);
