import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

const targets = [
  'Authenticating',
  'availableCredits',
  'Available AI Credits',
  'See Activity',
  'Get More AI Credits',
  'Recording',
  'recording',
  'here',
  'please login',
  'Log in to use',
  'Model Quota',
  'consumption options',
  'Insufficient AI Credits',
  'Purchase Credits',
  'No chat model metadata',
  'Model quota exhausted'
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
