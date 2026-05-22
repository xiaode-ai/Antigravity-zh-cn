import fs from 'fs';

const main = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');
const wb = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

console.log('main contains "Timed":', main.includes('Timed'));
console.log('wb contains "Timed":', wb.includes('Timed'));

const mainMatches = [];
let idx = 0;
while ((idx = main.indexOf('Timed', idx)) !== -1) {
  mainMatches.push(main.substring(idx - 50, idx + 80).replace(/\r?\n/g, ' '));
  idx += 5;
}
console.log('main matches:', mainMatches);
