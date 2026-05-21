import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(mainPath, 'utf8');

const term = 'b.color';
let idx = -1;
while ((idx = content.indexOf(term, idx + 1)) !== -1) {
  console.log(`Found "${term}" at index ${idx} in main.js:`);
  console.log(content.substring(idx - 100, idx + 300));
  console.log('-'.repeat(40));
}

