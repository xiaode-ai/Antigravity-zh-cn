import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = {
  'main.js.bak': path.join(outDir, 'jetskiAgent', 'main.js.bak'),
  'workbench.desktop.main.js': path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js'),
  'nls.messages.json': path.join(outDir, 'nls.messages.json')
};

const terms = [
  'Your plan\'s baseline quota',
  'baseline quota',
  'Enable Overages',
  'See plans.',
  'See Plans',
  'minutes ago',
  'timed out',
  'Timed',
  'seconds',
  'Walkthrough',
  'Customization',
  'Individual quota reached',
  'quota reached',
  'Ask anything',
  'baseline quota will refresh',
  'Google AI Ultra',
  'baseline quota will refresh on'
];

for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== Searching in ${name} (size: ${content.length}) ===`);
  
  terms.forEach(term => {
    let idx = content.indexOf(term);
    if (idx !== -1) {
      console.log(`  Found "${term}" at index ${idx}`);
      // Print context of 150 chars around
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + term.length + 150);
      console.log(`    Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
    }
  });
}
