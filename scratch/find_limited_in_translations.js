import fs from 'fs';
import path from 'path';

const transPath = 'c:\\Users\\i-cgh\\Documents\\GitHub\\antigravity-l10n\\translations.json';
const translations = JSON.parse(fs.readFileSync(transPath, 'utf8'));

const matches = translations.filter(t => t.old.toLowerCase().includes('limited'));
console.log(`Found ${matches.length} matches for 'limited' in translations.json:`);
matches.forEach((m, idx) => {
  console.log(`[Match ${idx+1}]`);
  console.log(`  old: ${m.old}`);
  console.log(`  new: ${m.new}`);
});
