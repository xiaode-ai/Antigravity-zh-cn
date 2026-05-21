import fs from 'fs';

const content = fs.readFileSync('scratch/search_results.txt', 'utf8');
const lines = content.split('\n');

let currentFile = '';
const fileGroups = {};

lines.forEach(line => {
  if (line.startsWith('=================== SEARCHING IN')) {
    currentFile = line.replace(/={2,}/g, '').trim();
    fileGroups[currentFile] = [];
  } else if (line.trim().startsWith('--- Term:') || line.trim().startsWith('[Match') || line.trim().startsWith('[EXACT]') || line.trim().startsWith('[PARTIAL]')) {
    if (currentFile) {
      fileGroups[currentFile].push(line);
    }
  }
});

const skipKeywords = ['es.array.copy-within', 'core-js', 'es6.array', 'd3', 'react', 'unscopables', 'typed-array', 'ArrayBuffer', 'Buffer', 'prototype', 'function', 'class', 'const', 'var', 'let', 'import', 'export'];

Object.entries(fileGroups).forEach(([fileName, groupLines]) => {
  if (fileName.includes('nls')) return; // Skip NLS
  console.log(`\n======================================================`);
  console.log(fileName);
  console.log(`======================================================`);
  
  let termHeader = '';
  let termMatches = [];
  
  groupLines.forEach(line => {
    if (line.trim().startsWith('--- Term:')) {
      if (termMatches.length > 0) {
        console.log(`\n  ${termHeader}`);
        termMatches.forEach(m => console.log(`    ${m}`));
      }
      termHeader = line.trim();
      termMatches = [];
    } else {
      const lineText = line.trim();
      const isNoise = skipKeywords.some(kw => lineText.includes(kw));
      if (!isNoise) {
        const lowerHeader = termHeader.toLowerCase();
        // For Profile/Edited, only keep matches that look like UI strings: e.g. contains label:, children:, tooltip:, etc.
        if (lowerHeader.includes('profile') || lowerHeader.includes('edited')) {
          if (/children:|label:|tooltip:|title:|placeholder:|text:|value:|ariaLabel:|aria-label:|button|click|action|"/i.test(lineText)) {
            termMatches.push(lineText.substring(0, 300));
          }
        } else {
          termMatches.push(lineText.substring(0, 300));
        }
      }
    }
  });
  
  if (termMatches.length > 0) {
    console.log(`\n  ${termHeader}`);
    termMatches.forEach(m => console.log(`    ${m}`));
  }
});
