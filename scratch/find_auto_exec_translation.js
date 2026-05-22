import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

const matches = translations.filter(t => t.old.includes('rl.EAGER'));
matches.forEach((m, idx) => {
  console.log(`\nMatch ${idx + 1}:`);
  console.log('OLD:', m.old.substring(0, 300) + '...');
  console.log('NEW:', m.new.substring(0, 300) + '...');
});
