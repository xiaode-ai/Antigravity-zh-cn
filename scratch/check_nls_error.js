import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsBakPath = path.join(outDir, 'nls.messages.json.bak');

function searchNls() {
  if (!fs.existsSync(nlsBakPath)) {
    console.log('nls.messages.json.bak not found.');
    return;
  }
  const nlsData = JSON.parse(fs.readFileSync(nlsBakPath, 'utf8'));
  console.log(`nlsData is an Array with ${nlsData.length} items.`);
  
  const targets = ['Error', 'Accept Changes', 'Edited files', 'Searched'];
  
  for (const target of targets) {
    console.log(`\n=== Occurrences of "${target}" in nls.messages.json ===`);
    let found = false;
    for (let i = 0; i < nlsData.length; i++) {
      const val = nlsData[i];
      if (typeof val === 'string' && (val === target || val.includes(target))) {
        console.log(`  Index ${i}: "${val}"`);
        found = true;
      }
    }
    if (!found) {
      console.log('  None found.');
    }
  }
}

searchNls();
