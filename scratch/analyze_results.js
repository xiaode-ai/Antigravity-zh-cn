import fs from 'fs';

const content = fs.readFileSync('scratch/untranslated_v5_results.txt', 'utf8');
const lines = content.split('\n');

let currentFile = '';
let currentTerm = '';

lines.forEach(line => {
  if (line.startsWith('==================== SEARCHING IN')) {
    currentFile = line;
    console.log('\n' + line);
  } else if (line.startsWith('--- Term:')) {
    currentTerm = line;
  } else if (line.startsWith('[') && line.includes('] Occur #')) {
    // Check if it looks like a UI candidate
    const ctx = line;
    // We want to filter or print
    // For specific terms, print the first few occurrences or all if they are short/relevant
    const lower = ctx.toLowerCase();
    if (currentTerm.includes('to navigate') || 
        currentTerm.includes('to select') || 
        currentTerm.includes('Search all convos') ||
        currentTerm.includes('Show ') || 
        currentTerm.includes('more...') ||
        currentTerm.includes('processes') || 
        currentTerm.includes('Recording') || 
        currentTerm.includes('Current') || 
        currentTerm.includes('Browser') ||
        currentTerm.includes('Ran')) {
      
      // Let's filter out some obvious non-UI browser matches to keep output readable
      if (currentTerm.includes('Browser') && (lower.includes('android browser') || lower.includes('blackberry browser') || lower.includes('kaios browser') || lower.includes('uc browser') || lower.includes('browserslist') || lower.includes('browserify') || lower.includes('useragent') || lower.includes('browserconnection'))) {
        return;
      }
      
      // Filter out non-UI Ran matches
      if (currentTerm.includes('Ran') && !lower.includes('"ran"') && !lower.includes("'ran'") && !lower.includes('ran:')) {
        return;
      }

      console.log(`${currentTerm} - ${ctx.substring(0, 300)}`);
    }
  }
});
