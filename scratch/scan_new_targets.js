import fs from 'fs';
import path from 'path';

const files = {
  jetskiAgent: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak',
  workbench: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak',
  nls: 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json'
};

const terms = [
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)',
  'Editor-Specific Settings',
  'Profile',
  'Move changes to main',
  'coy',
  'copy',
  'Good response',
  'Bad response',
  'files changed',
  'Review',
  'Worked for',
  'Thought for',
  'Explored',
  'Edited'
];

Object.entries(files).forEach(([name, filePath]) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  console.log(`\n=================== SEARCHING IN ${name} (${filePath}) ===================`);
  
  if (name === 'nls') {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    terms.forEach(term => {
      console.log(`\n--- Term: "${term}" ---`);
      let foundCount = 0;
      data.forEach((val, idx) => {
        if (typeof val === 'string') {
          if (val === term) {
            console.log(`  [EXACT] Index ${idx}: "${val}"`);
            foundCount++;
          } else if (val.toLowerCase().includes(term.toLowerCase())) {
            console.log(`  [PARTIAL] Index ${idx}: "${val}"`);
            foundCount++;
          }
        }
      });
      if (foundCount === 0) {
        console.log(`  Not found in NLS`);
      }
    });
  } else {
    const content = fs.readFileSync(filePath, 'utf8');
    terms.forEach(term => {
      console.log(`\n--- Term: "${term}" ---`);
      let idx = -1;
      let count = 0;
      while ((idx = content.indexOf(term, idx + 1)) !== -1) {
        count++;
        const context = content.substring(Math.max(0, idx - 80), Math.min(content.length, idx + term.length + 80));
        console.log(`  [Match ${count}] Index ${idx}: ... ${context.trim().replace(/\s+/g, ' ')} ...`);
      }
      if (count === 0) {
        console.log(`  Not found`);
      }
    });
  }
});
