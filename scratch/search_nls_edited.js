import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsBakPath = path.join(outDir, 'nls.messages.json.bak');

function search() {
  if (!fs.existsSync(nlsBakPath)) return;
  const nlsData = JSON.parse(fs.readFileSync(nlsBakPath, 'utf8'));
  for (let i = 0; i < nlsData.length; i++) {
    const val = nlsData[i];
    if (typeof val === 'string' && val.toLowerCase().includes('edited')) {
      console.log(`Index ${i}: "${val}"`);
    }
  }
}

search();
