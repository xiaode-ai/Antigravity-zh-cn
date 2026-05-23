import fs from 'fs';

const content = fs.readFileSync('scratch/untranslated_v5_results.txt', 'utf8');
const sections = content.split('==================== SEARCHING IN');

sections.forEach(section => {
  if (!section.trim()) return;
  const fileName = section.split('\n')[0].trim();
  console.log(`\n==================== ${fileName} ====================`);
  
  const terms = section.split('--- Term:');
  terms.forEach(termSec => {
    if (!termSec.trim()) return;
    const termLine = termSec.split('\n')[0].trim();
    const occurrences = termSec.split('\n').filter(l => l.startsWith('[') && l.includes('] Occur'));
    
    if (occurrences.length === 0) return;
    
    // We only care about our specific terms
    if (termLine.includes('to navigate') || 
        termLine.includes('to select') || 
        termLine.includes('Search all convos') || 
        termLine.includes('processes') || 
        termLine.includes('Recording') || 
        termLine.includes('Current') ||
        termLine.includes('Show ') ||
        termLine.includes('more...') ||
        termLine.includes('Ran')) {
      
      console.log(`  Term: ${termLine} (Count: ${occurrences.length})`);
      occurrences.forEach((occ, idx) => {
        const labelIndex = termSec.indexOf(occ);
        const nextLabelIndex = termSec.indexOf('[', labelIndex + 1);
        const occText = nextLabelIndex !== -1 ? termSec.substring(labelIndex, nextLabelIndex) : termSec.substring(labelIndex);
        const cleanText = occText.trim().replace(/\r?\n/g, ' ');
        
        // Filter out non-UI occurrences to keep it extremely clean
        const lower = cleanText.toLowerCase();
        if (termLine.includes('Browser') && (lower.includes('android browser') || lower.includes('blackberry browser') || lower.includes('kaios browser') || lower.includes('uc browser') || lower.includes('browserslist') || lower.includes('browserify') || lower.includes('useragent') || lower.includes('browserconnection'))) {
          return;
        }
        if (termLine.includes('Ran') && !lower.includes('"ran"') && !lower.includes("'ran'") && !lower.includes('ran:')) {
          return;
        }
        if (termLine.includes('Current') && !lower.includes('current window') && !lower.includes('current workspace') && !lower.includes('current conversation')) {
          return;
        }
        if (termLine.includes('Show ') && !lower.includes('show ') && !lower.includes('more')) {
          return;
        }
        
        console.log(`    #${idx + 1}: ${cleanText.substring(0, 200)}`);
      });
    }
  });
});
