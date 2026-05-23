import fs from 'fs';
import path from 'path';

const targetFilePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupSuffix = '.bak';

const nlsPath = path.join(path.dirname(targetFilePath), '..', 'nls.messages.json') + backupSuffix;

if (fs.existsSync(nlsPath)) {
  const content = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  content.forEach((val, idx) => {
    if (typeof val === 'string' && (val.toLowerCase().includes('files changed') || val.toLowerCase().includes('file changed') || val.toLowerCase().includes('changed file'))) {
      console.log(`[NLS Match] idx: ${idx}, val: "${val}"`);
    }
  });
} else {
  console.log('nls backup not found');
}
