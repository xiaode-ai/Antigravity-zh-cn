import fs from 'fs';
import path from 'path';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';

if (!fs.existsSync(nlsPath)) {
  console.log('nls.messages.json.bak not found');
  process.exit(1);
}

const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

nls.forEach((val, idx) => {
  if (typeof val === 'string') {
    if (val.toLowerCase().includes('limited')) {
      console.log(`[Index ${idx}] -> "${val}"`);
    }
  }
});
