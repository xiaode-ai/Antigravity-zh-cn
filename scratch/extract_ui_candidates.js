import fs from 'fs';

const rawCandidates = JSON.parse(fs.readFileSync('scratch/potential_remaining_english_ui.json', 'utf8'));

console.log(`Original candidates: ${rawCandidates.length}`);

const uiCandidates = [];
const seen = new Set();

// Tailwind or CSS utility patterns to reject
const tailwindWords = /^(flex|grid|hidden|block|inline|static|absolute|relative|fixed|w-\d+|h-\d+|p-\d+|m-\d+|bg-|text-|border-|rounded-|shadow-|opacity-|gap-|stroke-|transition|duration-|hover:|focus:|dark:|sm:|md:|lg:|xl:|col-|row-|items-|justify-|select-|cursor-|font-|leading-|tracking-|z-|overflow-|translate-|scale-|rotate-|animate-|pointer-|shrink-|grow-|self-|order-|basis-|float-|clear|px-|py-|pb-|pt-|pl-|pr-|mx-|my-|mb-|mt-|ml-|mr-|aspect-|columns-|flex-)/;

rawCandidates.forEach(c => {
  const str = c.string;
  
  // Skip flowchart/diagram shapes
  if (str.includes('shape') || str.includes('Represents') || str.includes('point') || str.includes('storage') || 
      str.includes('step') || str.includes('document') || str.includes('Comment') || str.includes('comment') || 
      str.includes('link') || str.includes('operation') || str.includes('Cylinder') || str.includes('Stadium') || 
      str.includes('Hexagon') || str.includes('Trapezoid') || str.includes('Hourglass') || str.includes('Brace')) {
    return;
  }
  
  // Basic sanity filters
  if (str.length < 3 || str.length > 100) return;
  
  // If it's all uppercase and short, might be a code constant
  if (str.toUpperCase() === str && str.length < 10) return;
  
  // Filter out strings with file paths, extensions, or JS code constructs
  if (str.includes('/') || str.includes('\\') || str.includes('=>') || str.includes('===') || str.includes('||')) return;
  if (str.includes('{') || str.includes('}') || str.includes('(') || str.includes(')')) return;
  if (str.includes('_') || str.includes('<') || str.includes('>') || str.includes('*')) return;
  if (str.includes('[') || str.includes(']')) return;
  
  // Check if any word looks like a tailwind class
  const words = str.trim().split(/\s+/);
  let hasTailwind = false;
  for (const w of words) {
    if (tailwindWords.test(w) || w.includes('-') && !/^[A-Za-z]+-[A-Za-z]+$/.test(w)) {
      hasTailwind = true;
      break;
    }
  }
  if (hasTailwind) return;
  
  // If it doesn't have spaces, it must start with a capital letter (likely a button or label like "Install", "Reload", "Browser")
  if (!str.includes(' ')) {
    if (!/^[A-Z][a-z]+$/.test(str)) {
      return; // Skip lowercase-only words or camelCase
    }
  } else {
    // If it has spaces, check if it contains reasonable letters
    if (!/^[A-Za-z0-9\s\p{P}]+$/u.test(str)) return;
  }
  
  // Avoid common words that are likely code config/keys if they are single words
  const configKeys = new Set(['GET', 'POST', 'PUT', 'DELETE', 'Accept', 'Content', 'Authorization', 'Bearer', 'Cache', 'Host']);
  if (configKeys.has(str)) return;

  if (!seen.has(str)) {
    seen.add(str);
    uiCandidates.push(c);
  }
});

console.log(`Filtered UI Candidates: ${uiCandidates.length}`);

fs.writeFileSync('scratch/filtered_ui_candidates.json', JSON.stringify(uiCandidates, null, 2), 'utf8');

// Print all filtered UI candidates
uiCandidates.forEach((c, idx) => {
  console.log(`${idx+1}. File: ${c.file} | String: "${c.string}"`);
  console.log(`   Match: ${c.match}`);
  console.log(`   Context: ...${c.context}...`);
  console.log();
});
