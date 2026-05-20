import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const target = 'Notification Settings';
let idx = content.indexOf(target);
if (idx !== -1) {
  console.log(`Found context for "${target}" (idx ${idx}):`);
  console.log(content.substring(idx - 300, idx + 400));
} else {
  console.log('NOT FOUND');
}
