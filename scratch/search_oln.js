import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

const idx = mainContent.indexOf('var oln=');
if (idx !== -1) {
  console.log('main.js var oln=:');
  console.log(mainContent.substring(idx, idx + 1000));
} else {
  // Let's search for "oln" usage or assignment
  let index = 0;
  let count = 0;
  while (true) {
    const i = mainContent.indexOf('oln', index);
    if (i === -1) break;
    count++;
    if (count <= 10) {
      console.log(`oln match ${count} at ${i}: ${mainContent.substring(i - 50, i + 50)}`);
    }
    index = i + 1;
  }
}
