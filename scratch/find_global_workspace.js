import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

if (wbContent) {
  // Let's search inside the customizations range: index 14370000 to 14380000
  const sub = wbContent.substring(14370000, 14380000);
  console.log('=== Global & Workspace search in customizations range ===');
  
  const terms = ['"Global"', '"Workspace"'];
  terms.forEach(term => {
    let idx = 0;
    while (true) {
      idx = sub.indexOf(term, idx);
      if (idx === -1) break;
      console.log(`Found ${term} at relative index ${idx} (absolute ${14370000 + idx}):`);
      console.log(sub.substring(idx - 100, idx + term.length + 100));
      idx += term.length;
    }
  });
} else {
  console.log('File not found');
}
