import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

console.log('--- Searching for dot-bounce in main.js.bak ---');
const idx = mainContent.indexOf('animate-dot-bounce');
if (idx !== -1) {
  console.log(mainContent.substring(idx - 300, idx + 600));
} else {
  console.log('animate-dot-bounce not found');
}
