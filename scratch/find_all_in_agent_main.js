import fs from 'fs';
import path from 'path';

const targetFilePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
if (!fs.existsSync(targetFilePath)) {
  console.error('File not found:', targetFilePath);
  process.exit(1);
}

const content = fs.readFileSync(targetFilePath, 'utf8');

const searchTerms = [
  'Agent',
  'Files',
  'Directories',
  'Code Context Items',
  'Limited time',
  'Limited-time',
  'limited time',
  'Fast',
  'Open Antigravity IDE User Settings',
  'Quick Settings Panel',
  'Docs',
  'Report Issue',
  'Changelog',
  'Antigravity - Settings'
];

console.log('=== SEARCHING FOR THE 12 TARGET TERMS IN jetskiAgent/main.js.bak ===');

searchTerms.forEach(term => {
  let idx = 0;
  let count = 0;
  console.log(`\n------------------ Term: "${term}" ------------------`);
  
  while (true) {
    idx = content.indexOf(term, idx);
    if (idx === -1) break;
    
    count++;
    
    // Filter to show context
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + term.length + 100);
    const context = content.substring(start, end).replace(/\r?\n/g, ' ');
    
    // Skip general code variables or known functions
    if (term === 'Agent' && (context.includes('userAgent') || context.includes('AgentManagerServices') || context.includes('AgentSidePanelServices') || context.includes('AgentMessage') || context.includes('AgentStatus'))) {
      idx += term.length;
      continue;
    }
    if (term === 'Files' && (context.includes('Files.js') || context.includes('.files') || context.includes('Files('))) {
      idx += term.length;
      continue;
    }
    
    console.log(`  Match #${count} at index ${idx}:`);
    console.log(`    Context: ... ${context} ...`);
    
    idx += term.length;
  }
});
