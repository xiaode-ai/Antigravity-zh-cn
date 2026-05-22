import fs from 'fs';

const transPath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(transPath, 'utf8'));

const matches = translations.filter(t => t.old.includes('displayResolver') && t.old.includes('turbo'));
console.log(`Found ${matches.length} matches`);
matches.forEach((m, idx) => {
  console.log(`\n[Match ${idx+1}]`);
  console.log(`OLD:\n${m.old}`);
  console.log(`NEW:\n${m.new}`);
});
