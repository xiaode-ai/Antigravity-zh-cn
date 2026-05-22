import fs from 'fs';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(mainBakPath)) {
  console.log('jetskiAgent/main.js.bak not found!');
  process.exit(1);
}

const content = fs.readFileSync(mainBakPath, 'utf8');

// Center of search is the getRenderInfo we found at index 10366721
const center = 10366721;
const start = Math.max(0, center - 20000);
const end = Math.min(content.length, center + 20000);

const region = content.substring(start, end);
console.log(`Analyzing region around getRenderInfo (length: ${region.length})`);

// We want to find occurrences of "Agent" in this region
let regex = /"Agent"/g;
let match;
while ((match = regex.exec(region)) !== null) {
  const localIdx = match.index;
  const globalIdx = start + localIdx;
  const s = Math.max(0, localIdx - 100);
  const e = Math.min(region.length, localIdx + 100);
  console.log(`Found "Agent" in region at local ${localIdx} (global ${globalIdx}):`);
  console.log(`  ... ${region.substring(s, e).replace(/\r?\n/g, ' ')} ...`);
}
