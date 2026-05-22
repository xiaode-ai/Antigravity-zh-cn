import fs from 'fs';
import path from 'path';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(mainBakPath)) {
  console.error('main.js.bak not found at ' + mainBakPath);
  process.exit(1);
}

const content = fs.readFileSync(mainBakPath, 'utf8');

const targets = [
  'Fast',
  'Analyzed',
  'Edited',
  'Ran',
  'Working',
  'Changes Overview',
  'Files With Changes',
  'Terminal (',
  'Processes Running',
  'Artifacts (',
  'Files for Conversation',
  'Reject all',
  'Reject All',
  'Browser',
  'Ask anything',
  'baseline quota',
  'Enable Overages',
  'See plans.',
  'minutes ago',
  'View conversation',
  'Copy to clipboard',
  'Export artifact',
  'Submit comment',
  'Add a message...',
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

console.log('Searching in ' + mainBakPath);
console.log('Total file length: ' + content.length);

targets.forEach(term => {
  console.log(`\n======================= TARGET: "${term}" =======================`);
  let idx = 0;
  let matches = [];
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    
    // Get context of 150 chars around
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + term.length + 150);
    const context = content.substring(start, end).replace(/\r?\n/g, ' ');
    matches.push({ index: idx, context });
    
    idx += term.length;
  }
  
  console.log(`Found ${matches.length} occurrences.`);
  matches.forEach((m, i) => {
    console.log(`\n  Match ${i + 1} at index ${m.index}:`);
    console.log(`  ${m.context}`);
  });
});
