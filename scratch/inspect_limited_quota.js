import fs from 'fs';

const wbBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
if (!fs.existsSync(wbBakPath)) {
  console.log('workbench.desktop.main.js.bak not found!');
  process.exit(1);
}

const content = fs.readFileSync(wbBakPath, 'utf8');

// Search for renderLimitedQuotaItem
let idx = 0;
let count = 0;
while (true) {
  idx = content.indexOf('renderLimitedQuotaItem', idx);
  if (idx === -1) break;
  count++;
  
  const start = Math.max(0, idx - 200);
  const end = Math.min(content.length, idx + 400);
  console.log(`\n[Match #${count}] at index ${idx}:`);
  console.log(`  ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  
  idx += 'renderLimitedQuotaItem'.length;
}
