import fs from 'fs';
import path from 'path';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));

const targets = [
  'Slow',
  'Fast',
  'Analyzed',
  'Edited',
  'Ran',
  'Working',
  'Changes Overview',
  'Background Processes Running',
  'Files With Changes',
  'Reject all',
  'Browser',
  'Ask anything',
  'Your plan\'s baseline quota',
  'Enable Overages',
  'See plans',
  'View conversation',
  'Copy to clipboard',
  'Export artifact',
  'Submit comment',
  'Add a message',
  'Select text in the artifact',
  'Proceed',
  'Proceed with implementation plan',
  'Implementation Plan',
  'Individual quota reached',
  'task',
  'Send Queued Message',
  'cancel',
  'Timed 60 seconds',
  'Walkthrough',
  'Customization'
];

console.log("=== CHECKING EXISTING TRANSLATIONS ===");
targets.forEach(target => {
  const matches = translations.filter(item => item.old.includes(target) || item.new.includes(target));
  if (matches.length > 0) {
    console.log(`\nTarget: "${target}" has ${matches.length} matching entries:`);
    matches.forEach((m, idx) => {
      console.log(`  [Match #${idx+1}]:`);
      console.log(`    OLD: ${m.old.substring(0, 100)}${m.old.length > 100 ? '...' : ''}`);
      console.log(`    NEW: ${m.new.substring(0, 100)}${m.new.length > 100 ? '...' : ''}`);
    });
  } else {
    console.log(`\nTarget: "${target}" has NO matching entries.`);
  }
});
