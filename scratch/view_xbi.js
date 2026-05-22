import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

console.log('main.js Xbi:');
const idx1 = mainContent.indexOf('Xbi=e=>{');
if (idx1 !== -1) {
  console.log(mainContent.substring(idx1, idx1 + 400));
}

console.log('\nworkbench jsu:');
const idx2 = wbContent.indexOf('jsu=t=>{');
if (idx2 !== -1) {
  console.log(wbContent.substring(idx2, idx2 + 400));
}
