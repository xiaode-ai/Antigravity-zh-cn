import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') }
];

const searchTerms = [
  'Toggle Agent (Ctrl+Alt+B)',
  'Toggle Agent',
  'Quick Open',
  'Open Browser (Preview)',
  'Profile',
  'Agent'
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) return;
  const content = fs.readFileSync(f.path, 'utf8');
  
  searchTerms.forEach(term => {
    let idx = 0;
    let count = 0;
    const quotes = [`"${term}"`, `'${term}'`, `children:"${term}"`, `label:"${term}"`, `title:"${term}"`, `value:"${term}"`, `tooltip:"${term}"`];
    
    quotes.forEach(q => {
      idx = 0;
      while (true) {
        idx = content.indexOf(q, idx);
        if (idx === -1) break;
        count++;
        const start = Math.max(0, idx - 80);
        const end = Math.min(content.length, idx + q.length + 80);
        console.log(`[MATCH #${count} of ${q} in ${f.name}]`);
        console.log(content.substring(start, end).replace(/\r?\n/g, ' '));
        idx += q.length;
      }
    });
  });
});
