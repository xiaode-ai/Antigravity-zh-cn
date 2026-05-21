import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

if (fs.existsSync(wbPath)) {
  const content = fs.readFileSync(wbPath, 'utf8');
  
  const terms = ['Past Conversations', 'Additional Options', 'Close Agent View'];
  
  terms.forEach(term => {
    console.log(`\n--- Term: "${term}" ---`);
    let idx = content.indexOf(term);
    if (idx !== -1) {
      console.log(`Found at index ${idx}`);
      console.log(`Context: ... ${content.substring(idx - 60, idx + term.length + 60).replace(/\r?\n/g, ' ')} ...`);
    } else {
      console.log('Not found');
    }
  });
} else {
  console.log('workbench.desktop.main.js.bak not found');
}
