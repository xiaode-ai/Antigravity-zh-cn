import fs from 'fs';

const content = fs.readFileSync('scratch/untranslated_v5_results.txt', 'utf8');
const sections = content.split('==================== SEARCHING IN');

sections.forEach(section => {
  if (!section.trim()) return;
  const fileName = section.split('\n')[0].trim();
  console.log(`\n>>> File: ${fileName}`);
  
  const terms = section.split('--- Term:');
  terms.forEach(termSec => {
    if (!termSec.trim()) return;
    const termLine = termSec.split('\n')[0].trim();
    
    // We care about specific terms:
    if (termLine.includes('processes') || 
        termLine.includes('Search all convos') || 
        termLine.includes('to navigate') || 
        termLine.includes('to select') || 
        termLine.includes('more...') || 
        termLine.includes('Recording') || 
        termLine.includes('Current')) {
      
      const occurrences = termSec.split('\n').filter(l => l.startsWith('[') && l.includes('] Occur'));
      console.log(`  Term: ${termLine} (Total: ${occurrences.length})`);
      occurrences.forEach((occ, idx) => {
        // Let's print the occurrence if it's not too many, or just print the first 5
        if (idx < 5) {
          // Find the lines after this occurrence label
          const labelIndex = termSec.indexOf(occ);
          const nextLabelIndex = termSec.indexOf('[', labelIndex + 1);
          const occText = nextLabelIndex !== -1 ? termSec.substring(labelIndex, nextLabelIndex) : termSec.substring(labelIndex);
          console.log(`    Occur #${idx + 1}: ${occText.trim().replace(/\r?\n/g, ' ').substring(0, 350)}`);
        }
      });
      if (occurrences.length > 5) {
        console.log(`    ... and ${occurrences.length - 5} more`);
      }
    }
  });
});
