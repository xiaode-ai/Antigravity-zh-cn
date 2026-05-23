import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = {
  mainBak: path.join(outDir, 'jetskiAgent', 'main.js.bak'),
  wbBak: path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak')
};

const targets = [
  'label:"Error"',
  'children:"Error"',
  'text:"Error"',
  ':"Error"'
];

function search() {
  for (const [name, filePath] of Object.entries(files)) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n================ SEARCHING ${name} ================`);
    
    for (const target of targets) {
      let index = 0;
      let count = 0;
      console.log(`\n  --- Target: ${target} ---`);
      while (true) {
        index = content.indexOf(target, index);
        if (index === -1) break;
        count++;
        
        const start = Math.max(0, index - 80);
        const end = Math.min(content.length, index + target.length + 120);
        const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
        console.log(`  [Match ${count}] Pos: ${index} | Snippet: ... ${snippet} ...`);
        
        index += target.length;
      }
      if (count === 0) {
        console.log(`  None found.`);
      }
    }
  }
}

search();
