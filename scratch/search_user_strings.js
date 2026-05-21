import fs from 'fs';
import path from 'path';

const filesToSearch = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak',
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
];

const searchTerms = [
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
  'Explored 1 task',
  'Explored 1 search',
  'Explored',
  'Edited',
  'Explored 1 folder',
  'Explored 1 file'
];

filesToSearch.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`[File Not Found] ${filePath}`);
    return;
  }
  
  console.log(`\nSearching in: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  searchTerms.forEach(term => {
    // Exact search
    const index = content.indexOf(term);
    if (index !== -1) {
      console.log(`  [MATCH] "${term}" found at index ${index}`);
      // Print context of 100 characters around the index
      const start = Math.max(0, index - 80);
      const end = Math.min(content.length, index + term.length + 80);
      const context = content.substring(start, end).replace(/\n/g, '\\n');
      console.log(`    Context: ... ${context} ...`);
    } else {
      console.log(`  [NOT FOUND] "${term}"`);
    }
  });
});
