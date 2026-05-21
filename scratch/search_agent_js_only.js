import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const filePath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');

const searchTerms = [
  'Toggle Agent (Ctrl+Alt+B)',
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)',
  'Profile',
  'Agent',
  'Past Conversations',
  'Additional Options',
  'Close Agent View',
  'Media',
  'Mentions',
  'Limited time',
  'Record Audio',
  'Stop Recording',
  'AI may make mistakes. Double-check all generated code.'
];

if (!fs.existsSync(filePath)) {
  console.log(`[File Not Found] ${filePath}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

searchTerms.forEach(term => {
  let idx = 0;
  let count = 0;
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    
    count++;
    const start = Math.max(0, idx - 120);
    const end = Math.min(content.length, idx + term.length + 120);
    const context = content.substring(start, end).replace(/\r?\n/g, ' ');
    console.log(`\n  ▶ Term: "${term}" (Occur #${count}, Index: ${idx})`);
    console.log(`    Context: ... ${context} ...`);
    
    idx += term.length;
  }
});
