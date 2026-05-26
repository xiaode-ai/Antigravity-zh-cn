import fs from 'fs';
import path from 'path';

const extPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';
const mainProcPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js.bak';

if (fs.existsSync(extPath)) {
  const extContent = fs.readFileSync(extPath, 'utf8');
  console.log('--- Searching in extension.js.bak ---');
  let idx = extContent.indexOf('failed to write file');
  if (idx !== -1) {
    console.log(`failed to write file found in extension.js.bak at ${idx}:`);
    console.log(extContent.substring(idx - 150, idx + 250));
  } else {
    console.log('failed to write file NOT found in extension.js.bak');
  }
  
  let idx2 = extContent.indexOf('Plugin Operation Error');
  if (idx2 !== -1) {
    console.log(`Plugin Operation Error found in extension.js.bak at ${idx2}:`);
    console.log(extContent.substring(idx2 - 150, idx2 + 250));
  }
}

if (fs.existsSync(mainProcPath)) {
  const mainProcContent = fs.readFileSync(mainProcPath, 'utf8');
  console.log('--- Searching in mainProcess.js.bak ---');
  let idx = mainProcContent.indexOf('failed to write file');
  if (idx !== -1) {
    console.log(`failed to write file found in mainProcess.js.bak at ${idx}:`);
    console.log(mainProcContent.substring(idx - 150, idx + 250));
  } else {
    console.log('failed to write file NOT found in mainProcess.js.bak');
  }
}
