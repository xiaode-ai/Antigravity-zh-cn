import fs from 'fs';

const dictPath = 'translations.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

console.log(`Translations dictionary items: ${dict.length}`);

dict.forEach((item, idx) => {
  if (item.old.toLowerCase().includes('limited') || item.new.toLowerCase().includes('limited')) {
    console.log(`[Item ${idx}]`);
    console.log(`  old: "${item.old}"`);
    console.log(`  new: "${item.new}"`);
  }
});
