import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');

if (fs.existsSync(nlsPath)) {
  const nlsData = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  
  const targets = ["Limited", "Fast", "Slow", "Docs", "Report Issue", "Changelog", "Quick Settings Panel"];
  
  targets.forEach(target => {
    console.log(`\n=== Finding "${target}" ===`);
    nlsData.forEach((val, idx) => {
      if (val === target) {
        console.log(`Index ${idx}: "${val}"`);
      }
    });
  });

  // Let's also check for things like "Open Antigravity IDE User Settings"
  console.log('\n=== Checking custom queries ===');
  nlsData.forEach((val, idx) => {
    if (typeof val === 'string') {
      if (val.includes('User Settings')) {
        console.log(`Index ${idx}: "${val}"`);
      }
      if (val.includes('Quick Settings')) {
        console.log(`Index ${idx}: "${val}"`);
      }
      if (val.includes('Antigravity - Settings')) {
        console.log(`Index ${idx}: "${val}"`);
      }
    }
  });
} else {
  console.error('nlsPath not found:', nlsPath);
}
