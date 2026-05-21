import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json');

if (fs.existsSync(nlsPath)) {
  const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  console.log(`Current index 4968: "${nls[4968]}"`);
} else {
  console.log('nls.messages.json not found');
}
