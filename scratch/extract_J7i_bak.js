import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(filePath, 'utf8');

const term = 'J7i=';
let idx = content.indexOf(term);
if (idx === -1) {
  idx = content.indexOf('function J7i');
}
if (idx !== -1) {
  console.log(`Found J7i at index ${idx}:`);
  console.log(content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 2000)));
} else {
  console.log('J7i definition not found');
}
