import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const translationsPath = 'translations.json';

const content = fs.readFileSync(backupPath, 'utf8');
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Checking ${translations.length} translations...`);
let mismatchCount = 0;

for (let i = 0; i < translations.length; i++) {
  const pair = translations[i];
  if (!content.includes(pair.old)) {
    mismatchCount++;
    console.log(`\n[MISMATCH #${mismatchCount}] Index: ${i}`);
    console.log(`Old text in dictionary (len: ${pair.old.length}):`);
    console.log(JSON.stringify(pair.old));
    
    // Let's search for substrings of this old text to see if we can find where it is or why it mismatched
    const firstPart = pair.old.substring(0, 30);
    const lastPart = pair.old.substring(pair.old.length - 30);
    console.log(`Sub-search first part ("${firstPart}"): ${content.includes(firstPart) ? 'Found' : 'Not Found'}`);
    console.log(`Sub-search last part ("${lastPart}"): ${content.includes(lastPart) ? 'Found' : 'Not Found'}`);
    
    if (content.includes(firstPart)) {
      const idx = content.indexOf(firstPart);
      console.log(`Found context in file (at idx ${idx}):`);
      console.log(content.substring(idx - 50, idx + pair.old.length + 100));
    }
  }
}

console.log(`\nTotal mismatches: ${mismatchCount}`);
