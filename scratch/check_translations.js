import fs from 'fs';

const dict = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

const targets = ["Analyzing", "Analyzed", "Changes Overview", "Process", "Proceed", "Quota", "quota", "Overages", "Reject", "Clipboard", "comment", "message", "Walkthrough", "Customization"];

targets.forEach(t => {
  console.log(`\nExisting translations for "${t}":`);
  const matches = dict.filter(item => item.old.includes(t) || item.new.includes(t));
  matches.forEach(m => {
    console.log(`  Old: ${m.old}\n  New: ${m.new}\n`);
  });
});
