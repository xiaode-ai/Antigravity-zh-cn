import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

const queries = ['Browser', 'current window', 'navigate', 'select', 'Record', 'Stop', 'Processes', 'Running', 'Ran', 'Show'];

queries.forEach(q => {
  console.log(`\n--- Matches for "${q}" ---`);
  const matches = translations.filter(t => t.old.toLowerCase().includes(q.toLowerCase()) || t.new.toLowerCase().includes(q.toLowerCase()));
  matches.forEach(m => {
    console.log(`  Old: "${m.old}"\n  New: "${m.new}"`);
  });
});
