import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

console.log('=== main.js near Send Queued Message ===');
let idx1 = mainContent.indexOf('Send Queued Message');
if (idx1 !== -1) {
  console.log(mainContent.substring(idx1 - 150, idx1 + 150));
} else {
  console.log('Not found in main.js');
}

console.log('\n=== workbench near Send Queued Message ===');
let idx2 = wbContent.indexOf('Send Queued Message');
if (idx2 !== -1) {
  console.log(wbContent.substring(idx2 - 150, idx2 + 150));
} else {
  console.log('Not found in workbench');
}
