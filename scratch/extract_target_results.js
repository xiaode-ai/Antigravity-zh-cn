import fs from 'fs';

const content = fs.readFileSync('scratch/search_results.txt', 'utf8');
const lines = content.split('\n');

let currentFile = '';
let currentTerm = '';

lines.forEach(line => {
  if (line.startsWith('=================== SEARCHING IN')) {
    currentFile = line;
    console.log(`\n${currentFile}`);
  } else if (line.startsWith('--- Term:')) {
    currentTerm = line;
  } else if (line.trim().startsWith('[Match') || line.trim().startsWith('[EXACT]') || line.trim().startsWith('[PARTIAL]')) {
    // Only print if it's not a generic node_modules/library Match (unless it's in jetskiAgent or workbench or nls)
    if (!line.includes('es.array.copy-within') && !line.includes('core-js') && !line.includes('es6.array') && !line.includes('d3') && !line.includes('react')) {
      console.log(`  ${currentTerm}`);
      console.log(`    ${line.trim()}`);
    }
  }
});
