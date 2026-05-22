import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');

const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';
const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';

const words = ["Snooze", "Start", "Manage", "Launch", "Browser"];

function searchWords(content, name) {
  if (!content) return;
  console.log(`\n=== SEARCHING WORDS IN ${name} ===`);
  
  words.forEach(word => {
    console.log(`\n--- Word: "${word}" ---`);
    let idx = 0;
    let found = [];
    while (true) {
      const nextIdx = content.indexOf(word, idx);
      if (nextIdx === -1) break;
      found.push(nextIdx);
      idx = nextIdx + 1;
    }
    
    // 筛选出包含 children:"Word", label:"Word", title:"Word" 等的上下文
    const relevant = found.filter(pos => {
      const chunk = content.substring(Math.max(0, pos - 30), Math.min(content.length, pos + word.length + 30));
      return chunk.includes('children') || chunk.includes('label') || chunk.includes('title') || chunk.includes('text') || chunk.includes('button');
    });
    
    console.log(`  Found ${found.length} total, ${relevant.length} look like UI rendering.`);
    relevant.slice(0, 10).forEach((pos, i) => {
      const chunk = content.substring(pos - 40, pos + word.length + 40).replace(/\r?\n/g, ' ');
      console.log(`    [#${i+1}] At ${pos}: ... ${chunk} ...`);
    });
  });
}

searchWords(wbContent, 'wb.js.bak');
searchWords(mainContent, 'main.js.bak');
