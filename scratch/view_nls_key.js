import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const keysPath = path.join(targetDir, 'nls.keys.json');

if (fs.existsSync(keysPath)) {
  const keys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
  console.log(`Key at index 4968: "${keys[4968]}"`);
} else {
  console.log('nls.keys.json not found');
}
