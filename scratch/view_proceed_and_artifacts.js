import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

console.log('=== main.js Proceed/Implementation Plan ===');
let idx1 = mainContent.indexOf('Proceed with implementation plan');
if (idx1 !== -1) {
  console.log(mainContent.substring(idx1 - 150, idx1 + 250));
} else {
  console.log('Not found in main.js');
}

console.log('\n=== workbench Proceed/Implementation Plan ===');
let idx2 = wbContent.indexOf('Proceed with implementation plan');
if (idx2 !== -1) {
  console.log(wbContent.substring(idx2 - 150, idx2 + 250));
} else {
  console.log('Not found in workbench');
}

console.log('\n=== main.js Walkthrough/Task icons ===');
let idx3 = mainContent.indexOf('Icon for Jetski artifacts named "Implementation Plan"');
if (idx3 !== -1) {
  console.log(mainContent.substring(idx3 - 100, idx3 + 300));
} else {
  console.log('Not found in main.js');
}

console.log('\n=== workbench Walkthrough/Task icons ===');
let idx4 = wbContent.indexOf('Icon for Jetski artifacts named "Implementation Plan"');
if (idx4 !== -1) {
  console.log(wbContent.substring(idx4 - 100, idx4 + 300));
} else {
  console.log('Not found in workbench');
}
