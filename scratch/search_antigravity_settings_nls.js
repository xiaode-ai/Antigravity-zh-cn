import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');

if (fs.existsSync(nlsPath)) {
  const nlsData = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  console.log('Searching nls.messages.json.bak for "antigravity"...');
  nlsData.forEach((val, idx) => {
    if (typeof val === 'string' && val.toLowerCase().includes('antigravity')) {
      console.log(`Index ${idx}: "${val}"`);
    }
  });
} else {
  console.error('nlsPath not found:', nlsPath);
}
