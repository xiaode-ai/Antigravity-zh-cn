import fs from 'fs';
import path from 'path';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const targets = [
  'Recording',
  'recording',
  'RECORDING',
  'Available AI Credits',
  'Get More AI Credits',
  'See Activity',
  'Authenticating',
  'Login'
];

targets.forEach(target => {
  console.log(`=== Matches for "${target}" ===`);
  let idx = 0;
  while (true) {
    idx = content.indexOf(target, idx);
    if (idx === -1) break;
    const start = Math.max(0, idx - 80);
    const end = Math.min(content.length, idx + target.length + 80);
    console.log(`[Pos ${idx}]: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    idx += target.length;
  }
  console.log();
});
