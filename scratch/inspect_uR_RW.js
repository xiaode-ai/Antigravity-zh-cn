import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

console.log('--- main.js uR details ---');
// uR 声明大概是 uR=({ 或者 uR=e=>
const idx1 = mainContent.indexOf('uR=({');
if (idx1 !== -1) {
  console.log(mainContent.substring(idx1 - 100, idx1 + 2500));
} else {
  const idx1_2 = mainContent.indexOf('uR=');
  if (idx1_2 !== -1) {
    console.log(mainContent.substring(idx1_2 - 50, idx1_2 + 2500));
  }
}

console.log('\n--- workbench.desktop.main.js RW details ---');
const idx2 = wbContent.indexOf('RW=({');
if (idx2 !== -1) {
  console.log(wbContent.substring(idx2 - 100, idx2 + 2500));
} else {
  const idx2_2 = wbContent.indexOf('RW=');
  if (idx2_2 !== -1) {
    console.log(wbContent.substring(idx2_2 - 50, idx2_2 + 2500));
  }
}
