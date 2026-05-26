import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak', 'utf8');

console.log('--- Searching for "Plugin Operation Error" in main.js.bak ---');
let lastIdx1 = 0;
while (true) {
  const idx = mainContent.indexOf('Plugin Operation Error', lastIdx1);
  if (idx === -1) break;
  console.log(`Match at ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 250));
  console.log('-------------------------');
  lastIdx1 = idx + 1;
}

console.log('--- Searching for "Plugin Operation Error" in workbench ---');
let lastIdx2 = 0;
while (true) {
  const idx = wbContent.indexOf('Plugin Operation Error', lastIdx2);
  if (idx === -1) break;
  console.log(`Match at ${idx}:`);
  console.log(wbContent.substring(idx - 150, idx + 250));
  console.log('-------------------------');
  lastIdx2 = idx + 1;
}

console.log('--- Searching for "failed to write file" in main.js.bak ---');
let lastIdx3 = 0;
while (true) {
  const idx = mainContent.indexOf('failed to write file', lastIdx3);
  if (idx === -1) break;
  console.log(`Match at ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 250));
  console.log('-------------------------');
  lastIdx3 = idx + 1;
}
