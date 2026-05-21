import fs from 'fs';

const results = fs.readFileSync('scratch/search_results.txt', 'utf8').split('\n');

const terms = [
  'Toggle Agent (Ctrl+Alt+B)',
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)',
  'Profile',
  'Agent',
  'Past Conversations',
  'Additional Options',
  'Close Agent View',
  'Media',
  'Mentions',
  'Limited time',
  'Record Audio',
  'AI may make mistakes. Double-check all generated code.'
];

let out = '=== Filtered Results ===\n';
terms.forEach(term => {
  out += `\n--- Term: "${term}" ---\n`;
  let foundCount = 0;
  
  for (let i = 0; i < results.length; i++) {
    const line = results[i];
    if (line.includes(`Term: "${term}"`) || (line.includes(`Index:`) && line.includes(term))) {
      // Ignore backup files to focus on active files
      if (line.includes('main.js.bak') || line.includes('workbench.desktop.main.js.bak') || line.includes('nls.messages.json.bak')) {
        continue;
      }
      
      // Let's filter out false positives for generic words
      // e.g. for "Profile", we only care about UI-like strings (like Profile badge, profile specific, etc.) or exact matches
      if (term === 'Profile' || term === 'Agent' || term === 'Media' || term === 'Mentions') {
        const isJsonMatch = line.includes('[JSON');
        const isJsMatch = line.includes('[JS MATCH]');
        
        // For JS matches, check if the context looks like UI text, e.g. children: "Profile" or label: "Profile" or "Profile" as a standalone string
        let nextLine = '';
        if (isJsMatch && results[i + 1] && results[i + 1].startsWith('   Context:')) {
          nextLine = results[i + 1];
        }
        
        const isUiText = nextLine.includes(`"${term}"`) || nextLine.includes(`'${term}'`) || nextLine.includes(`children:[\"${term}\"`) || nextLine.includes(`label:\"${term}\"`) || nextLine.includes(`title:\"${term}\"`) || nextLine.includes(`children:\"${term}\"`);
        
        if (!isJsonMatch && !isUiText) {
          continue; // skip noise
        }
      }
      
      out += line + '\n';
      if (results[i + 1] && results[i + 1].startsWith('   Context:')) {
        out += results[i + 1] + '\n';
      }
      foundCount++;
    }
  }
  if (foundCount === 0) {
    out += '(No active matches found)\n';
  }
});

fs.writeFileSync('scratch/filtered_results.txt', out, 'utf8');
console.log('Filtered results written to scratch/filtered_results.txt');
