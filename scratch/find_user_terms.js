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
  'Global',
  'Workspace',
  'Back to Agent',
  'Customize Agent to get a better, more personalized experience.Learn more.',
  'Rules help guide the behavior of Agent.',
  'Workflows',
  'Workflows are saved prompts that Agent can follow.To trigger a workflow, type "/" in Agent.',
  'executor has not processed the previous input yet',
  'Files',
  'Directories',
  'Code Context Items',
  'Limited time',
  'Fast',
  'Open Antigravity IDE User Settings',
  'Quick Settings Panel',
  'Docs',
  'Report Issue',
  'Changelog',
  'Antigravity - Settings',
  'Terminal (0 Background Processes Running)',
  'Browser',
  'Pages currently open in Antigravity\'s Browser instance are shown below.',
  'View side-by-side diff',
  '0 pages',
  'Export',
  'Launch',
  'Search all convos...',
  'Current',
  'Show 8 more...',
  'to navigate',
  'to select'
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
      const start = Math.max(0, idx - 120);
      const end = Math.min(content.length, idx + term.length + 120);
      const context = content.substring(start, end).replace(/\r?\n/g, ' ');
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
          if (typeof val === 'string' && (val === term || val.includes(term))) {
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
} else {
  log(`[File Not Found] nls.messages.json.bak`);
}

fs.writeFileSync(path.join(process.cwd(), 'scratch', 'search_results.txt'), output, 'utf8');
log(`\n[OK] Results written to scratch/search_results.txt`);
