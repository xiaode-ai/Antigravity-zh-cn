import fs from 'fs';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(mainBakPath)) {
  console.log('jetskiAgent/main.js.bak not found!');
  process.exit(1);
}

const content = fs.readFileSync(mainBakPath, 'utf8');

// We search for renderQuotaItem or quota-item
let idx = 0;
while (true) {
  idx = content.indexOf('quota', idx);
  if (idx === -1) break;
  
  // print context if it looks like a rendering method or UI string
  const start = Math.max(0, idx - 100);
  const end = Math.min(content.length, idx + 200);
  const context = content.substring(start, end);
  if (context.includes('render') || context.includes('p(') || context.includes('children') || context.includes('className')) {
    console.log(`Found "quota" at index ${idx}:`);
    console.log(`  ... ${context.replace(/\r?\n/g, ' ')} ...`);
  }
  
  idx += 5;
}
