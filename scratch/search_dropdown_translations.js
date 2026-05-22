import fs from 'fs';

const transPath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(transPath, 'utf8'));

function checkTerm(term) {
  const matches = translations.filter(t => t.old.includes(term) || t.new.includes(term));
  console.log(`\n=== Finding "${term}" (Found ${matches.length} matches) ===`);
  matches.forEach((m, idx) => {
    console.log(`[Match ${idx+1}]`);
    console.log(`  old: ${m.old}`);
    console.log(`  new: ${m.new}`);
  });
}

checkTerm('e0.ALWAYS');
checkTerm('e0.TURBO');
checkTerm('Always Ask');
checkTerm('Always Proceed');
checkTerm('Request Review');
checkTerm('每次询问');
checkTerm('始终执行');
checkTerm('需要审核');
