import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';

const filesToSearch = [
  {
    name: 'main.js.bak',
    path: path.join(targetDir, 'jetskiAgent', 'main.js.bak')
  },
  {
    name: 'workbench.desktop.main.js.bak',
    path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak')
  },
  {
    name: 'workbench.desktop.main.js',
    path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js')
  },
  {
    name: 'nls.messages.json.bak',
    path: path.join(targetDir, 'nls.messages.json.bak')
  },
  {
    name: 'nls.messages.json',
    path: path.join(targetDir, 'nls.messages.json')
  }
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

filesToSearch.forEach(file => {
  if (!fs.existsSync(file.path)) {
    console.log(`[File Not Found] ${file.name} at ${file.path}`);
    return;
  }
  
  console.log(`\n================ Searching ${file.name} ================`);
  const content = fs.readFileSync(file.path, 'utf8');
  
  if (file.name.endsWith('.json') || file.name.endsWith('.json.bak')) {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        data.forEach((val, idx) => {
          if (typeof val === 'string') {
            searchTerms.forEach(term => {
              if (val.includes(term)) {
                console.log(`[JSON MATCH] Index ${idx}: "${val}"`);
              }
            });
          }
        });
      }
    } catch (e) {
      console.error(`Failed to parse JSON for ${file.name}:`, e.message);
    }
  } else {
    // JS file
    searchTerms.forEach(term => {
      let idx = 0;
      while (true) {
        idx = content.indexOf(term, idx);
        if (idx === -1) break;
        
        // Extract 150 chars context around
        const start = Math.max(0, idx - 100);
        const end = Math.min(content.length, idx + term.length + 100);
        const context = content.substring(start, end).replace(/\r?\n/g, ' ');
        console.log(`[JS MATCH] Term: "${term}" at position ${idx}`);
        console.log(`   Context: ... ${context} ...`);
        
        idx += term.length; // move forward
      }
    });
  }
});
