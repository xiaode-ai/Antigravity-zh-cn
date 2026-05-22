import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const workbenchBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const searchTerms = [
  'Fast',
  'Analyzed',
  'Edited',
  'Ran',
  'Working',
  'Changes Overview',
  'Files With Changes',
  'Terminal',
  'Background Processes Running',
  'Artifacts',
  'Files for Conversation',
  'Reject all',
  'Browser',
  'Ask anything',
  'to mention',
  'for actions',
  'Your plan\'s baseline quota',
  'You can upgrade to a Google AI Ultra plan',
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
  'Error Individual quota reached.',
  'task',
  'Send Queued Message',
  'cancel',
  'Timed 60 seconds',
  'Walkthrough',
  'Customization'
];

if (!fs.existsSync(mainBakPath)) {
  console.error(`Error: ${mainBakPath} not found`);
  process.exit(1);
}

const mainContent = fs.readFileSync(mainBakPath, 'utf8');

console.log('=== SEARCHING main.js.bak ===');
searchTerms.forEach(term => {
  let idx = 0;
  let matches = [];
  while (true) {
    idx = mainContent.indexOf(term, idx);
    if (idx === -1) break;
    matches.push(idx);
    idx += term.length;
  }
  
  if (matches.length > 0) {
    console.log(`\nFound "${term}" in main.js.bak ${matches.length} times:`);
    matches.forEach((pos, mIdx) => {
      const start = Math.max(0, pos - 150);
      const end = Math.min(mainContent.length, pos + term.length + 150);
      const context = mainContent.substring(start, end).replace(/\r?\n/g, ' ');
      console.log(`  [Match ${mIdx + 1}] Pos: ${pos}`);
      console.log(`    Context: ... ${context} ...`);
    });
  } else {
    console.log(`\n"${term}" not found in main.js.bak`);
  }
});

if (fs.existsSync(workbenchBakPath)) {
  const wbContent = fs.readFileSync(workbenchBakPath, 'utf8');
  console.log('\n=== SEARCHING workbench.desktop.main.js.bak ===');
  searchTerms.forEach(term => {
    let idx = 0;
    let matches = [];
    while (true) {
      idx = wbContent.indexOf(term, idx);
      if (idx === -1) break;
      matches.push(idx);
      idx += term.length;
    }
    
    if (matches.length > 0) {
      console.log(`\nFound "${term}" in workbench.desktop.main.js.bak ${matches.length} times:`);
      matches.forEach((pos, mIdx) => {
        const start = Math.max(0, pos - 150);
        const end = Math.min(wbContent.length, pos + term.length + 150);
        const context = wbContent.substring(start, end).replace(/\r?\n/g, ' ');
        console.log(`  [Match ${mIdx + 1}] Pos: ${pos}`);
        console.log(`    Context: ... ${context} ...`);
      });
    }
  });
}
