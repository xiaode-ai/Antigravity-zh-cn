import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

console.log('--- Searching for Oki= in main.js.bak ---');
const idx = mainContent.indexOf('Oki=');
if (idx !== -1) {
  console.log(mainContent.substring(idx - 150, idx + 2500));
} else {
  console.log('Oki= not found');
}
