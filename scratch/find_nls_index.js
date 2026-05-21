import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');

if (!fs.existsSync(nlsPath)) {
  console.log('nls.messages.json.bak does not exist');
  process.exit(0);
}

const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

nls.forEach((val, idx) => {
  if (typeof val === 'string') {
    if (val.toLowerCase().includes('toggle agent')) {
      console.log(`Index ${idx}: "${val}"`);
    }
  }
});
