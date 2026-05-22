import fs from 'fs';

const dict = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

console.log('Existing translations containing "quota" or "Quota":');
dict.forEach((item, index) => {
  if (item.old.toLowerCase().includes('quota') || item.new.toLowerCase().includes('quota')) {
    console.log(`[${index}]`);
    console.log(`  Old: ${item.old}`);
    console.log(`  New: ${item.new}\n`);
  }
});
