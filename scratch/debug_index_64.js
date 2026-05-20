import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const translationsPath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const pair = translations[64];
console.log(`Index 64:`);
console.log(`Old: ${JSON.stringify(pair.old)}`);
console.log(`New: ${JSON.stringify(pair.new)}`);
console.log(`content.includes(pair.old): ${content.includes(pair.old)}`);

if (!content.includes(pair.old)) {
  console.log('Why not found? Let us check char codes:');
  const target = `label:"Auto-Open Edited Files",description:"Open files in the background if Agent creates or edits them"`;
  console.log(`target in content: ${content.includes(target)}`);
  
  console.log('pair.old length:', pair.old.length);
  console.log('target length:', target.length);
  
  for (let i = 0; i < Math.max(pair.old.length, target.length); i++) {
    if (pair.old[i] !== target[i]) {
      console.log(`Diff at char ${i}: pair.old code = ${pair.old.charCodeAt(i)} ("${pair.old[i]}"), target code = ${target.charCodeAt(i)} ("${target[i]}")`);
      break;
    }
  }
}
