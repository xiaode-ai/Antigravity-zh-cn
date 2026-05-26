import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

const targetStr = `u=s.replace(/[_-]/g," ").replace(/([a-z])([A-Z])/g,"$1 $2").split(/\\s+/).filter(d=>d.length>0).map(d=>d.charAt(0).toUpperCase()+d.slice(1).toLowerCase()).join(" ")`;

console.log('Searching for targetStr in main.js.bak...');
let lastIdx = 0;
let count = 0;
while (true) {
  const idx = mainContent.indexOf(targetStr, lastIdx);
  if (idx === -1) break;
  count++;
  console.log(`Match ${count} at ${idx}:`);
  console.log(mainContent.substring(idx - 150, idx + 300));
  console.log('-------------------------');
  lastIdx = idx + 1;
}
console.log(`Total count: ${count}`);
