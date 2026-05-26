import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

console.log('--- Searching for Bye( in main.js ---');
let lastIdx1 = 0;
while (true) {
  const idx = mainContent.indexOf('Bye(', lastIdx1);
  if (idx === -1) break;
  console.log(`Bye( called at ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 150));
  console.log('-------------------------');
  lastIdx1 = idx + 1;
}

console.log('--- Searching for b8t( in workbench ---');
let lastIdx2 = 0;
while (true) {
  const idx = wbContent.indexOf('b8t(', lastIdx2);
  if (idx === -1) break;
  console.log(`b8t( called at ${idx}:`);
  console.log(wbContent.substring(idx - 150, idx + 150));
  console.log('-------------------------');
  lastIdx2 = idx + 1;
}
