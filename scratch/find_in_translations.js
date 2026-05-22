import fs from 'fs';
import path from 'path';

const transPath = 'c:\\Users\\i-cgh\\Documents\\GitHub\\antigravity-l10n\\translations.json';
const translations = JSON.parse(fs.readFileSync(transPath, 'utf8'));

function checkTerm(term) {
  const matches = translations.filter(t => t.old.includes(term));
  console.log(`\n=== Finding "${term}" in translations.json (Found ${matches.length} matches) ===`);
  matches.forEach((m, idx) => {
    console.log(`[Match ${idx+1}]`);
    console.log(`  old: ${m.old.substring(0, 150)}`);
    console.log(`  new: ${m.new.substring(0, 150)}`);
  });
}

checkTerm('Tab Speed');
checkTerm('FAST:return');
checkTerm('SLOW:return');
checkTerm('Autocomplete Speed');
checkTerm('Files');
checkTerm('Directories');
checkTerm('Code Context Items');
