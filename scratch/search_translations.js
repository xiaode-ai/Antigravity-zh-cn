import fs from 'fs';

const translationsPath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const keywords = ["Browser", "Tab", "Notifications", "Permissions", "General"];
keywords.forEach(keyword => {
  console.log(`\n=== Translations containing "${keyword}": ===`);
  const matches = translations.filter(t => t.old.includes(keyword) || t.new.includes(keyword));
  matches.forEach(m => {
    console.log(JSON.stringify(m, null, 2));
  });
});
