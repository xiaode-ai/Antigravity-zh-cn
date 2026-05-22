import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');

if (fs.existsSync(nlsPath)) {
  const nlsData = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  nlsData.forEach((val, idx) => {
    if (typeof val === 'string' && val.toLowerCase().includes('limited')) {
      console.log(`[NLS MATCH] Index ${idx}: "${val}"`);
    }
  });
}
