import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');

if (fs.existsSync(nlsPath)) {
  const nlsData = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  const indicesToCheck = [5008, 5015, 5018, 4978, 4979, 4980, 317504, 317535, 6128, 6307, 6309];
  console.log('=== Checking NLS Indices ===');
  indicesToCheck.forEach(idx => {
    console.log(`Index ${idx}: "${nlsData[idx]}"`);
  });
} else {
  console.error('nls.messages.json.bak not found at', nlsPath);
}
