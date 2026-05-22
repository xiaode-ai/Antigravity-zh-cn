import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

console.log('main.js KGi:');
const idx1 = mainContent.indexOf('KGi=(e,t)=>{');
if (idx1 !== -1) {
  console.log(mainContent.substring(idx1, idx1 + 600));
}
