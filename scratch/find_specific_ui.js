import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.readFileSync(mainBakPath, 'utf8');

const targets = [
  'Changes Overview',
  'Files With Changes',
  'Terminal',
  'Background Processes Running',
  'Artifacts',
  'Files for Conversation',
  'Reject all',
  'Browser',
  'Ask anything',
  'Your plan\'s baseline quota',
  'Enable Overages',
  'See plans.',
  'minutes ago',
  'View conversation',
  'Copy to clipboard',
  'Export artifact',
  'Submit comment',
  'Add a message...',
  'Select text in the artifact to add a comment',
  'Proceed',
  'Proceed with implementation plan',
  'Implementation Plan',
  'Individual quota reached',
  'Send Queued Message',
  'cancel',
  'Timed 60 seconds',
  'Walkthrough',
  'Customization',
  'Fast',
  'Analyzed',
  'Edited',
  'Ran',
  'Working'
];

targets.forEach(term => {
  let idx = 0;
  let count = 0;
  console.log(`\n=== Matches for "${term}" ===`);
  while (true) {
    idx = mainContent.indexOf(term, idx);
    if (idx === -1) break;
    count++;
    
    // Check if it's a string literal or react children structure
    const start = Math.max(0, idx - 100);
    const end = Math.min(mainContent.length, idx + term.length + 100);
    const context = mainContent.substring(start, end).replace(/\r?\n/g, ' ');
    console.log(`  Match ${count} at ${idx}: ... ${context} ...`);
    
    idx += term.length;
  }
  if (count === 0) {
    console.log('  No matches found.');
  }
});
