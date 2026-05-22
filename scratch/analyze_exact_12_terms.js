import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  { name: 'jetskiAgent/main.js.bak', path: path.join(targetDir, 'jetskiAgent', 'main.js.bak') },
  { name: 'workbench.desktop.main.js.bak', path: path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak') }
];
const nlsPath = path.join(targetDir, 'nls.messages.json.bak');

const searchTerms = [
  'Agent',
  'Files',
  'Directories',
  'Code Context Items',
  'Limited time',
  'Limited-time',
  'limited time',
  'Fast',
  'Open Antigravity IDE User Settings',
  'Quick Settings Panel',
  'Docs',
  'Report Issue',
  'Changelog',
  'Antigravity - Settings'
];

let output = '';
function log(msg) {
  console.log(msg);
  output += msg + '\n';
}

files.forEach(f => {
  if (!fs.existsSync(f.path)) {
    log(`[File Not Found] ${f.name}`);
    return;
  }

  log(`\n=================== FILE: ${f.name} ===================`);
  const content = fs.readFileSync(f.path, 'utf8');

  searchTerms.forEach(term => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;

      count++;
      
      // 过滤一些极其常见的无关匹配，比如 userAgent
      const start = Math.max(0, idx - 100);
      const end = Math.min(content.length, idx + term.length + 100);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
      
      if (term === 'Agent' && (context.includes('userAgent') || context.includes('AgentManagerServices') || context.includes('AgentSidePanelServices') || context.includes('AgentMessage') || context.includes('AgentStatus'))) {
        idx += term.length;
        continue;
      }
      if (term === 'Files' && (context.includes('Files.js') || context.includes('.files') || context.includes('Files('))) {
        idx += term.length;
        continue;
      }

      log(`\n  ▶ Term: "${term}" (Occur #${count}, Index: ${idx})`);
      log(`    Context: ... ${context} ...`);

      idx += term.length;
    }
  });
});

if (fs.existsSync(nlsPath)) {
  log(`\n=================== FILE: nls.messages.json.bak ===================`);
  try {
    const nlsData = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
    if (Array.isArray(nlsData)) {
      searchTerms.forEach(term => {
        nlsData.forEach((val, idx) => {
          if (typeof val === 'string' && (val === term || val.toLowerCase().includes(term.toLowerCase()))) {
            log(`\n  ▶ Term: "${term}" matched in NLS Array`);
            log(`    Index: ${idx}`);
            log(`    Value: "${val}"`);
          }
        });
      });
    }
  } catch (err) {
    log(`[Error parsing NLS] ${err.message}`);
  }
}

fs.writeFileSync(path.join(process.cwd(), 'scratch', 'exact_12_terms_analysis.txt'), output, 'utf8');
log(`\n[OK] Results written to scratch/exact_12_terms_analysis.txt`);
