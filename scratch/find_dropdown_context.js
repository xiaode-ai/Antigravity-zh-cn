import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.readFileSync(mainPath, 'utf8');

function showContext(term, lengthBefore = 200, lengthAfter = 500) {
  let idx = 0;
  while (true) {
    idx = mainContent.indexOf(term, idx);
    if (idx === -1) break;
    console.log(`\n=================== Found "${term}" at index ${idx} ===================`);
    const start = Math.max(0, idx - lengthBefore);
    const end = Math.min(mainContent.length, idx + term.length + lengthAfter);
    console.log(mainContent.substring(start, end));
    idx += term.length;
  }
}

showContext('Review Policy');
showContext('CASCADE_AUTO_EXECUTION_POLICY');
showContext('Browser Javascript Execution Policy');
