import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';

const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'jetskiAgent/main.js', path: path.join(targetDir, 'jetskiAgent', 'main.js') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') },
  { name: 'workbench.desktop.main.js', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js') },
  { name: 'nls.messages.json.bak', path: path.join(targetDir, 'nls.messages.json.bak') },
  { name: 'nls.messages.json', path: path.join(targetDir, 'nls.messages.json') }
];

const searchTerms = [
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

let out = '';

files.forEach(f => {
  if (!fs.existsSync(f.path)) {
    out += `[File Not Found] ${f.name}\n`;
    return;
  }
  
  const content = fs.readFileSync(f.path, 'utf8');
  
  if (f.name.endsWith('.json') || f.name.endsWith('.json.bak')) {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        data.forEach((val, idx) => {
          if (typeof val === 'string') {
            searchTerms.forEach(term => {
              if (val === term) {
                out += `[JSON EXACT MATCH] File: ${f.name}, Index: ${idx}, Value: "${val}"\n`;
              } else if (val.includes(term)) {
                // For long sentences or specific combinations
                out += `[JSON PARTIAL MATCH] File: ${f.name}, Index: ${idx}, Term: "${term}", Value: "${val}"\n`;
              }
            });
          }
        });
      }
    } catch (e) {
      out += `Error parsing ${f.name}: ${e.message}\n`;
    }
  } else {
    // Javascript file
    searchTerms.forEach(term => {
      let idx = 0;
      let count = 0;
      while (true) {
        idx = content.indexOf(term, idx);
        if (idx === -1) break;
        
        count++;
        // Context
        const start = Math.max(0, idx - 80);
        const end = Math.min(content.length, idx + term.length + 80);
        const context = content.substring(start, end).replace(/\r?\n/g, ' ');
        out += `[JS MATCH] File: ${f.name}, Term: "${term}", Occur: ${count}, Index: ${idx}\n`;
        out += `   Context: ... ${context} ...\n`;
        
        idx += term.length;
      }
    });
  }
});

fs.writeFileSync('scratch/search_results.txt', out, 'utf8');
console.log('Done! Results written to scratch/search_results.txt');
