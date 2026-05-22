import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json');

if (fs.existsSync(nlsPath)) {
  const data = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  console.log(`NLS index 5021: "${data[5021]}"`);
} else {
  console.log('nls.messages.json not found');
}
