import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

function inspect(content, name) {
  console.log(`\n\n================ INSPECTING ${name} ================`);
  const keywords = ['Accept', 'Edited', 'edited', 'Changes', 'changes'];
  
  // Find any string literal or React children with these keywords
  const regex = /["']([^"']*(?:Accept|Edited|edited|Changes|changes)[^"']*)["']/gi;
  
  let match;
  let count = 0;
  while ((match = regex.exec(content)) !== null) {
    const val = match[1];
    if (val.length > 50) continue; // Skip very long code strings
    count++;
    const start = Math.max(0, match.index - 50);
    const end = Math.min(content.length, match.index + match[0].length + 50);
    console.log(`[${count}] Index ${match.index} Match: "${match[0]}"`);
    console.log(`    Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    if (count >= 50) {
      console.log('... reached limit of 50 matches ...');
      break;
    }
  }
}

inspect(mainContent, 'main.js.bak');
inspect(wbContent, 'workbench.desktop.main.js.bak');
