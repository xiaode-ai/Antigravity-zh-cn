import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const term = 'Editing';
const idx = content.indexOf('?"file":"files"');
if (idx !== -1) {
  console.log(`Found file/files at index ${idx}`);
  console.log(`Context: ${content.substring(idx - 150, idx + 250)}`);
} else {
  console.log('?"file":"files" not found');
}
