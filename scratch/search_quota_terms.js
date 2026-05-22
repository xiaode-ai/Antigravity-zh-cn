import fs from 'fs';
import path from 'path';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';
if (!fs.existsSync(nlsPath)) {
  console.log('nls.messages.json.bak not found');
  process.exit(1);
}

const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

nls.forEach((val, idx) => {
  if (typeof val === 'string') {
    const lval = val.toLowerCase();
    if (lval.includes('time') && lval.includes('limit')) {
      console.log(`[Index ${idx}] -> "${val}"`);
    } else if (lval.includes('quota') || lval.includes('usage')) {
      if (lval.length < 100) {
        console.log(`[Index ${idx} Quota/Usage] -> "${val}"`);
      }
    }
  }
});
