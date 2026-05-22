import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('scratch/locate_user_request_results_utf8.txt', 'utf8');
const blocks = content.split('\n  ▶ ');

const filterTerms = [
  'Directories',
  'Code Context Items',
  'Fast',
  'Docs',
  'Report Issue',
  'Changelog',
  'Quick Settings Panel',
  'Agent',
  'Files'
];

let output = [];

output.push('=== FILTERED RELEVANT CONTEXTS ===');

blocks.forEach(block => {
  const lines = block.split('\n');
  const header = lines[0];
  
  let term = '';
  for (const t of filterTerms) {
    if (header.startsWith(`Term: "${t}"`) || header.startsWith(`NLS Match: "${t}"`)) {
      term = t;
      break;
    }
  }
  
  if (!term) return;

  // For NLS matches, just print them directly
  if (header.startsWith('NLS Match:')) {
    output.push(`NLS: ${header}`);
    return;
  }

  // For JS matches, get the context line
  const contextLine = lines.find(l => l.trim().startsWith('Context:'));
  if (!contextLine) return;

  const contextIdx = contextLine.indexOf('Context: ...');
  if (contextIdx === -1) return;
  const context = contextLine.substring(contextIdx + 12).trim();

  // We are looking for children, label, title, text, te(xxx, "term"), or similar UI declarations
  const isUi = 
    context.includes('children:') || 
    context.includes('label:') || 
    context.includes('title:') || 
    context.includes('tooltip:') || 
    context.includes('placeholder:') ||
    context.includes('te(') ||
    context.includes('p("') ||
    context.includes('R("') ||
    context.includes('text:') ||
    context.includes('displayName') ||
    context.includes('Settings') ||
    context.includes('displayName:');

  if (isUi) {
    output.push(`\nJS MATCH FOR "${term}":`);
    output.push(`  ${header}`);
    output.push(`  Context: ${context.substring(0, 300)}`);
  }
});

fs.writeFileSync('scratch/extracted_relevant_matches.txt', output.join('\n'), 'utf8');
console.log('Wrote results to scratch/extracted_relevant_matches.txt');
