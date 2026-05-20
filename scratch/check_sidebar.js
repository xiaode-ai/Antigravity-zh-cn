import fs from 'fs';

const translationsPath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const matches = translations.filter(t => t.old.toLowerCase().includes('notification') || t.new.includes('通知'));
console.log(`Found ${matches.length} matches:`);
matches.forEach(m => {
  console.log(JSON.stringify(m, null, 2));
});
