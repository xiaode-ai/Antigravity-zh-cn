import fs from 'fs';
import path from 'path';

const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js';
const mainProcPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js';

if (fs.existsSync(extPath)) {
  const extContent = fs.readFileSync(extPath, 'utf8');
  console.log('--- Searching in extension.js ---');
  let idx = extContent.indexOf('failed to write file');
  if (idx !== -1) {
    console.log(`failed to write file found in extension.js at ${idx}:`);
    console.log(extContent.substring(idx - 150, idx + 250));
  } else {
    console.log('failed to write file NOT found in extension.js');
  }
}

if (fs.existsSync(mainProcPath)) {
  const mainProcContent = fs.readFileSync(mainProcPath, 'utf8');
  console.log('--- Searching in main.js ---');
  let idx = mainProcContent.indexOf('failed to write file');
  if (idx !== -1) {
    console.log(`failed to write file found in main.js at ${idx}:`);
    console.log(mainProcContent.substring(idx - 150, idx + 250));
  } else {
    console.log('failed to write file NOT found in main.js');
  }
}
