import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

function search(query) {
  console.log(`Searching for "${query}":`);
  const matches = translations.filter(t => t.old.includes(query) || t.new.includes(query));
  matches.forEach((m, idx) => {
    console.log(`\n--- Match ${idx + 1} ---`);
    console.log('OLD:\n', m.old);
    console.log('NEW:\n', m.new);
  });
}

search('e0.TURBO');
search('resolveOptionToString');
search('ARTIFACT_REVIEW_MODE');
search('Always Ask');
