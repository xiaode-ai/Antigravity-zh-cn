import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const mainContent = fs.readFileSync(mainBakPath, 'utf8');

const targets = [
  'Changes Overview',
  'Files With Changes',
  'Terminal (',
  'Processes Running',
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

console.log('=== TARGETED SEARCH IN main.js.bak ===');

targets.forEach(term => {
  let idx = 0;
  let count = 0;
  console.log(`\n--- Results for "${term}" ---`);
  while (true) {
    idx = mainContent.indexOf(term, idx);
    if (idx === -1) break;
    
    // Extract context
    const start = Math.max(0, idx - 150);
    const end = Math.min(mainContent.length, idx + term.length + 150);
    const context = mainContent.substring(start, end).replace(/\r?\n/g, ' ');
    
    // We only want matches that are likely UI strings (e.g. quotes around it, react children, label:, title:, placeholder:, etc.)
    const isUIString = 
      context.includes(`"${term}"`) || 
      context.includes(`'${term}'`) || 
      context.includes(`\`${term}\``) ||
      context.includes(`>${term}<`) ||
      context.includes(`:${term}`) ||
      context.includes(`"${term} `) ||
      context.includes(` ${term}"`) ||
      context.includes(`children:[`) ||
      context.includes(`children:"`) ||
      context.includes(`label:"`) ||
      context.includes(`title:"`) ||
      context.includes(`placeholder:"`);

    if (isUIString) {
      count++;
      console.log(`  Match ${count} at ${idx}: ... ${context} ...`);
    }
    
    idx += term.length;
  }
  if (count === 0) {
    console.log('  No UI matches found.');
  }
});
