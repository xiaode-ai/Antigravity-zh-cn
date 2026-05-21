import fs from 'fs';
import path from 'path';

const lpPath = 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE\\languagepacks.json';
if (fs.existsSync(lpPath)) {
  console.log(fs.readFileSync(lpPath, 'utf8'));
} else {
  console.log('Not found');
}
