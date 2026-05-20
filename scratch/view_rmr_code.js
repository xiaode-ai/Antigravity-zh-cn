import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');
const lines = content.split('\n');
const line = lines[3659]; // line 3660

const startIdx = line.indexOf('function rMr(');
const endIdx = line.indexOf('function yot(');

if (startIdx !== -1 && endIdx !== -1) {
  console.log(line.substring(startIdx, endIdx));
} else {
  console.log(`Could not find functions. startIdx: ${startIdx}, endIdx: ${endIdx}`);
}
