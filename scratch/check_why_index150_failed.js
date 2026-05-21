import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(targetPath, 'utf8');

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

console.log(`Total translations: ${translations.length}`);
let skipped = [];
translations.forEach((t, i) => {
  if (!content.includes(t.old)) {
    skipped.push({ index: i, old: t.old });
  }
});

console.log(`Skipped translations count: ${skipped.length}`);
console.log('Sample skipped translations:');
skipped.slice(0, 15).forEach(s => {
  console.log(`[Index ${s.index}] ${s.old.substring(0, 80)}...`);
});

// Specifically check Index 150
const is150Skipped = skipped.some(s => s.index === 150);
console.log(`\nIs Index 150 skipped? ${is150Skipped}`);

