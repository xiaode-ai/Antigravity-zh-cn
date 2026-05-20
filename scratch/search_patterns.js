import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const targets = [
  'name:"Error"',
  'name:"Prompt"',
  'name:"Errors"',
  'name:"Cancel"',
  'name:"Close"',
  'name:"Status"'
];

console.log('=== Protobuf type name search in main.js.bak ===');
for (const t of targets) {
  const count = content.split(t).length - 1;
  console.log(`Pattern '${t}': found ${count} occurrences`);
  if (count > 0) {
    let idx = 0;
    for (let i = 0; i < Math.min(count, 3); i++) {
      idx = content.indexOf(t, idx);
      console.log(`  [Occurrence ${i+1}] index ${idx}:`);
      console.log(`    ${content.substring(idx - 100, idx + 100)}`);
      idx += t.length;
    }
  }
}
