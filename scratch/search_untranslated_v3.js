import fs from 'fs';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const wbBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';

const mainContent = fs.readFileSync(mainBakPath, 'utf8');
const wbContent = fs.readFileSync(wbBakPath, 'utf8');

const targets = [
  'Browser',
  'Search all convos',
  'Current',
  'Show ',
  'to navigate',
  'to select',
  'Ran',
  'background processes'
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
    const start = Math.max(0, mainIdx - 80);
    const end = Math.min(mainContent.length, mainIdx + t.length + 80);
    const context = mainContent.substring(start, end).replace(/\r?\n/g, ' ');
    // Filter out common JS code stuff to only show UI strings
    if (context.includes('children') || context.includes('title') || context.includes('label') || context.includes('placeholder') || context.includes('message') || context.includes('text')) {
      console.log(`[main.js] Match ${mainCount} at ${mainIdx}:`);
      console.log(`  ... ${context} ...`);
    }
    mainIdx += t.length;
    if (mainCount > 20) break;
  }

  // Search workbench.desktop.main.js.bak
  let wbIdx = 0;
  let wbCount = 0;
  while (true) {
    wbIdx = wbContent.indexOf(t, wbIdx);
    if (wbIdx === -1) break;
    wbCount++;
    const start = Math.max(0, wbIdx - 80);
    const end = Math.min(wbContent.length, wbIdx + t.length + 80);
    const context = wbContent.substring(start, end).replace(/\r?\n/g, ' ');
    if (context.includes('children') || context.includes('title') || context.includes('label') || context.includes('placeholder') || context.includes('message') || context.includes('text')) {
      console.log(`[workbench.desktop.main.js] Match ${wbCount} at ${wbIdx}:`);
      console.log(`  ... ${context} ...`);
    }
    wbIdx += t.length;
    if (wbCount > 20) break;
  }
});
