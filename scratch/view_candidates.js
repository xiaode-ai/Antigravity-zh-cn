import fs from 'fs';

const candidates = JSON.parse(fs.readFileSync('scratch/candidate_english_strings.json', 'utf8'));

console.log(`Total candidate strings: ${candidates.length}`);

// Let's filter candidates that look like actual English sentences or UI labels
// by excluding strings with special characters or that look like internal IDs
const uiCandidates = candidates.filter(c => {
  const s = c.string;
  
  // Filter out typical dev paths/namespaces or short uppercase words
  if (s.includes('::') || s.includes('/') || s.includes('\\')) return false;
  if (/^[A-Z_0-9]+$/.test(s) && s.length > 5) return false;
  
  // Must have spaces or capitalization indicating natural language
  const hasSpaces = s.includes(' ');
  const hasMixedCase = /[a-z]/.test(s) && /[A-Z]/.test(s);
  
  if (!hasSpaces && !hasMixedCase) return false;
  
  // Filter out typical camelCase names with no spaces that look like API terms
  if (!hasSpaces && /^[a-z]+[A-Z]/.test(s) && s.length > 10) return false;
  
  return true;
});

console.log(`Filtered UI candidates count: ${uiCandidates.length}`);

// Print the first 150 candidates
uiCandidates.slice(0, 150).forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.string}] (Raw: ${c.raw})`);
  console.log(`   Context: ${c.context.substring(0, 180)}`);
  console.log('----------------------------------------------------');
});
