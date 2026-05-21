import fs from 'fs';
import path from 'path';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';
if (fs.existsSync(nlsPath)) {
  const content = fs.readFileSync(nlsPath, 'utf8');
  const data = JSON.parse(content);
  data.forEach((val, idx) => {
    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      if (lower.includes('time') && lower.includes('limit')) {
        console.log(`[MATCH] Index: ${idx}, Value: "${val}"`);
      }
    }
  });
} else {
  console.log('nls.messages.json.bak not found');
}
