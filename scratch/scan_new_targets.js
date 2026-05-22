import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.readFileSync(mainBakPath, 'utf8');

const targets = [
  'Changes Overview',
  'Files With Changes',
  'Terminal (',
  'Background Processes Running',
  'Artifacts (',
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
  'task',
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

console.log('=== EXACT MATCH CONTEXTS IN main.js.bak ===');
targets.forEach(term => {
  let idx = 0;
  let count = 0;
  while (true) {
    idx = mainContent.indexOf(term, idx);
    if (idx === -1) break;
    count++;
    
    // Only print first 5 matches per term to keep output clean and readable
    if (count <= 5) {
      const start = Math.max(0, idx - 120);
      const end = Math.min(mainContent.length, idx + term.length + 120);
      const context = mainContent.substring(start, end).replace(/\r?\n/g, ' ');
      console.log(`[FOUND] "${term}" at ${idx}`);
      console.log(`   Context: ... ${context} ...`);
    }
    idx += term.length;
  }
  if (count > 5) {
    console.log(`   ... and ${count - 5} more matches for "${term}"`);
  }
  if (count === 0) {
    console.log(`[NOT FOUND] "${term}"`);
  }
});
