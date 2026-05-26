import fs from 'fs';

const wbPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';

if (fs.existsSync(wbPath)) {
  const wbContent = fs.readFileSync(wbPath, 'utf8');
  console.log('--- Searching in workbench ---');
  let idx = wbContent.indexOf('Enable Antigravity to deploy apps');
  if (idx !== -1) {
    console.log(`Found at ${idx}`);
  } else {
    console.log('Not found in workbench');
  }
}

if (fs.existsSync(extPath)) {
  const extContent = fs.readFileSync(extPath, 'utf8');
  console.log('--- Searching in extension.js ---');
  let idx = extContent.indexOf('Enable Antigravity to deploy apps');
  if (idx !== -1) {
    console.log(`Found at ${idx}:`);
    console.log(extContent.substring(idx - 150, idx + 250));
  } else {
    console.log('Not found in extension.js');
  }
}
