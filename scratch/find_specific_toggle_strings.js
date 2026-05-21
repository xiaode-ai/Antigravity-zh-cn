import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') }
];

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
  'Limited time',
  'Record Audio',
  'Stop Recording',
  'AI may make mistakes. Double-check all generated code.'
];

// For Media and Mentions, we only want matches that look like UI labels/strings (e.g. quotes, label, children, title)
const specialTerms = [
  { term: 'Media', pattern: /["']Media["']|label:\s*["']Media["']|children:\s*["']Media["']|title:\s*["']Media["']/ },
  { term: 'Mentions', pattern: /["']Mentions["']|label:\s*["']Mentions["']|children:\s*["']Mentions["']|title:\s*["']Mentions["']/ }
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) {
    console.log(`[File Not Found] ${f.name}`);
    return;
  }
  
  console.log(`\n=================== FILE: ${f.name} ===================`);
  const content = fs.readFileSync(f.path, 'utf8');
  
  searchTerms.forEach(term => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      
      count++;
      const start = Math.max(0, idx - 80);
      const end = Math.min(content.length, idx + term.length + 80);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      console.log(`  ▶ Term: "${term}" (Occur #${count}, Index: ${idx})`);
      console.log(`    Context: ... ${context} ...`);
      
      idx += term.length;
    }
  });

  specialTerms.forEach(({ term, pattern }) => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      
      const start = Math.max(0, idx - 40);
      const end = Math.min(content.length, idx + term.length + 40);
      const snippet = content.substring(start, end);
      
      if (pattern.test(snippet)) {
        count++;
        console.log(`  ▶ Special Term: "${term}" (Occur #${count}, Index: ${idx})`);
        console.log(`    Context: ... ${snippet.replace(/\r?\n/g, ' ')} ...`);
      }
      
      idx += term.length;
    }
  });
});
