import fs from 'fs';

const candidates = JSON.parse(fs.readFileSync('scratch/candidate_english_strings.json', 'utf8'));

const keywords = ['authenticat', 'credit', 'activity', 'recording', 'login', 'sign', 'here', 'business', 'consumption', 'insufficient'];

const found = [];
candidates.forEach(c => {
  const match = keywords.some(k => c.string.toLowerCase().includes(k));
  if (match) {
    found.push(c);
  }
});

console.log(`Found ${found.length} matches:`);
found.forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.string}] (Raw: ${c.raw})`);
  console.log(`   Context: ${c.context.substring(0, 200)}`);
  console.log('----------------------------------------------------');
});
