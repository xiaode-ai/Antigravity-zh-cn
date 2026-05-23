import fs from 'fs';
import path from 'path';

const targetFilePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const files = {
  'extension.js': path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js'),
  'extension.js.bak': path.join(path.dirname(targetFilePath), '..', '..', 'extensions', 'antigravity', 'dist', 'extension.js.bak'),
  'workbench.desktop.main.js': path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js'),
  'workbench.desktop.main.js.bak': path.join(path.dirname(targetFilePath), '..', 'vs', 'workbench', 'workbench.desktop.main.js.bak')
};

const searchPhrases = [
  'Select where to open the conversation',
  'Open in current window',
  'Continue conversation in the current workspace',
  'Open in workspace',
  'Export',
  'Export Artifact',
  'files changed',
  'Listed',
  'finished'
];

for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    console.log(`[NOT FOUND] ${name}`);
    continue;
  }
  console.log(`\n================ Checking ${name} ================`);
  const content = fs.readFileSync(filePath, 'utf8');
  for (const phrase of searchPhrases) {
    let index = -1;
    while ((index = content.indexOf(phrase, index + 1)) !== -1) {
      const start = Math.max(0, index - 80);
      const end = Math.min(content.length, index + phrase.length + 80);
      const snippet = content.substring(start, end).replace(/\n/g, ' ');
      console.log(`  ▶ Found "${phrase}" at Index: ${index}`);
      console.log(`    Context: ... ${snippet} ...`);
    }
  }
}
