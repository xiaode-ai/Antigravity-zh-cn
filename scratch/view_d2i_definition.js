import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

const idx = mainContent.indexOf('d2i=');
if (idx !== -1) {
  console.log('main.js d2i=:');
  console.log(mainContent.substring(idx, idx + 2000));
} else {
  console.log('d2i not found');
}
