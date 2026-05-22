import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

function searchPages(content, name) {
  if (!content) return;
  console.log(`\n=== SEARCHING 'pages' IN ${name} ===`);
  
  let idx = 0;
  while (true) {
    const nextPages = content.indexOf('pages', idx);
    if (nextPages === -1) break;
    const start = Math.max(0, nextPages - 60);
    const end = Math.min(content.length, nextPages + 80);
    const chunk = content.substring(start, end).replace(/\r?\n/g, ' ');
    // 筛选出看起来像是 React 组件、文本插值或 NLS 的上下文
    if (chunk.includes('{') || chunk.includes('children') || chunk.includes('`') || chunk.includes('"') || chunk.includes("'")) {
      console.log(`  At ${nextPages}: ... ${chunk} ...`);
    }
    idx = nextPages + 1;
  }
}

searchPages(mainContent, 'main.js.bak');
searchPages(wbContent, 'wb.js.bak');
