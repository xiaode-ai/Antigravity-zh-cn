import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

const targets = [
  'Browser',
  'Screenshot',
  'Console logs',
  'Recent actions',
  'Working directory',
  'Mention Page',
  'Capture screenshot',
  'Taking Screenshot',
  'Took Screenshot'
];

targets.forEach(t => {
  const matches = translations.filter(pair => 
    pair.old.toLowerCase().includes(t.toLowerCase()) || 
    pair.new.toLowerCase().includes(t.toLowerCase())
  );
  console.log(`=== Matches in translations.json for "${t}": ${matches.length} ===`);
  matches.forEach(m => {
    console.log(`  Old: ${m.old}`);
    console.log(`  New: ${m.new}`);
  });
  console.log();
});
