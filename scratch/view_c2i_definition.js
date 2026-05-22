import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

const idx = mainContent.indexOf('c2i=');
if (idx !== -1) {
  console.log('main.js c2i=:');
  console.log(mainContent.substring(idx - 100, idx + 1200));
} else {
  console.log('c2i not found');
}
