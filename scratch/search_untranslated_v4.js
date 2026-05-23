import fs from 'fs';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const wbBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';

const mainContent = fs.readFileSync(mainBakPath, 'utf8');
const wbContent = fs.readFileSync(wbBakPath, 'utf8');

const targets = [
  'Recording...',
  'Recording',
  'Browser',
  'Search all convos',
  'Current',
  'Ran',
  'background processes',
  'Terminal'
];

targets.forEach(t => {
  console.log(`\n================ Target: "${t}" ================`);
  
  // Search main.js.bak
  let mainIdx = 0;
  let mainCount = 0;
  while (true) {
    mainIdx = mainContent.indexOf(t, mainIdx);
    if (mainIdx === -1) break;
    mainCount++;
    const start = Math.max(0, mainIdx - 150);
    const end = Math.min(mainContent.length, mainIdx + t.length + 150);
    const context = mainContent.substring(start, end).replace(/\r?\n/g, ' ');
    console.log(`[main.js] Match ${mainCount} at ${mainIdx}:`);
    console.log(`  ... ${context} ...`);
    mainIdx += t.length;
    if (mainCount >= 15) {
      console.log(`[main.js] Too many matches for "${t}", stopping...`);
      break;
    }
  }

  // Search workbench.desktop.main.js.bak
  let wbIdx = 0;
  let wbCount = 0;
  while (true) {
    wbIdx = wbContent.indexOf(t, wbIdx);
    if (wbIdx === -1) break;
    wbCount++;
    const start = Math.max(0, wbIdx - 150);
    const end = Math.min(wbContent.length, wbIdx + t.length + 150);
    const context = wbContent.substring(start, end).replace(/\r?\n/g, ' ');
    console.log(`[workbench.desktop.main.js] Match ${wbCount} at ${wbIdx}:`);
    console.log(`  ... ${context} ...`);
    wbIdx += t.length;
    if (wbCount >= 15) {
      console.log(`[workbench.desktop.main.js] Too many matches for "${t}", stopping...`);
      break;
    }
  }
});
