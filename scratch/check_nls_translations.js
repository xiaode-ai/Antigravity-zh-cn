import fs from 'fs';
import path from 'path';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json';
if (!fs.existsSync(nlsPath)) {
  console.log('nls.messages.json not found');
  process.exit(1);
}

const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

const timeKeys = Object.keys(nls).filter(k => k.includes('date.fromNow') || k.includes('fromNow'));
console.log(`Found ${timeKeys.length} date/time NLS keys.`);
timeKeys.forEach(k => {
  console.log(`  "${k}": "${nls[k]}"`);
});
