import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');

if (fs.existsSync(nlsPath)) {
  const nlsData = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  console.log(`Index 6119: "${nlsData[6119]}"`);
  for (let i = 6110; i <= 6135; i++) {
    console.log(`Index ${i}: "${nlsData[i]}"`);
  }
} else {
  console.log('nls.messages.json.bak not found');
}
