import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

// 寻找 View all ... shortcuts
const viewAllRegex = /["'`][^"'`]*View\s+all[^"'`]*shortcuts[^"'`]*["'`]/gi;
// 寻找 Background ... Running 
const backgroundRegex = /["'`][^"'`]*Background[^"'`]*Running[^"'`]*["'`]/gi;
const processRunningRegex = /["'`][^"'`]*Process[^"'`]*Running[^"'`]*["'`]/gi;

function searchIn(content, name) {
  if (!content) return;
  console.log(`\n=== SEARCHING IN ${name} ===`);
  
  let match;
  console.log('--- View all shortcuts patterns ---');
  viewAllRegex.lastIndex = 0;
  while ((match = viewAllRegex.exec(content)) !== null) {
    console.log(`  Index ${match.index}: ${match[0]}`);
  }
  
  console.log('--- Background Running patterns ---');
  backgroundRegex.lastIndex = 0;
  while ((match = backgroundRegex.exec(content)) !== null) {
    console.log(`  Index ${match.index}: ${match[0]}`);
  }
  
  console.log('--- Process Running patterns ---');
  processRunningRegex.lastIndex = 0;
  while ((match = processRunningRegex.exec(content)) !== null) {
    console.log(`  Index ${match.index}: ${match[0]}`);
  }
  
  // 额外搜一下 "View all" 附近有 shortcuts
  console.log('--- View all AND shortcuts proximity ---');
  let idx = 0;
  while (true) {
    const nextViewAll = content.indexOf('View all', idx);
    if (nextViewAll === -1) break;
    const chunk = content.substring(Math.max(0, nextViewAll - 50), Math.min(content.length, nextViewAll + 150));
    if (chunk.toLowerCase().includes('shortcuts')) {
      console.log(`  At ${nextViewAll}: ... ${chunk.replace(/\r?\n/g, ' ')} ...`);
    }
    idx = nextViewAll + 1;
  }

  // 额外搜一下 "Background" 附近有 "Running"
  console.log('--- Background AND Running proximity ---');
  idx = 0;
  while (true) {
    const nextBg = content.indexOf('Background', idx);
    if (nextBg === -1) break;
    const chunk = content.substring(Math.max(0, nextBg - 50), Math.min(content.length, nextBg + 150));
    if (chunk.toLowerCase().includes('running')) {
      console.log(`  At ${nextBg}: ... ${chunk.replace(/\r?\n/g, ' ')} ...`);
    }
    idx = nextBg + 1;
  }
}

searchIn(mainContent, 'main.js.bak');
searchIn(wbContent, 'workbench.desktop.main.js.bak');
