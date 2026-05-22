import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

console.log('main.js quota:');
const idx1 = mainContent.indexOf("Your plan's baseline quota");
if (idx1 !== -1) {
  console.log(mainContent.substring(idx1 - 400, idx1 + 400));
}

console.log('\nworkbench quota:');
const idx2 = wbContent.indexOf("Your plan's baseline quota");
if (idx2 !== -1) {
  console.log(wbContent.substring(idx2 - 400, idx2 + 400));
}
