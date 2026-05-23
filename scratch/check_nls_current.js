import fs from 'fs';
import path from 'path';

const targetFilePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const nlsPath = path.join(path.dirname(targetFilePath), '..', 'nls.messages.json');

if (fs.existsSync(nlsPath)) {
  const content = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  console.log(`Index 6012 value in nls.messages.json: "${content[6012]}"`);
  console.log(`Index 48 value in nls.messages.json: "${content[48]}"`);
} else {
  console.log('nls.messages.json not found');
}
