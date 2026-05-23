import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js');

const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const wbContent = fs.existsSync(wbPath) ? fs.readFileSync(wbPath, 'utf8') : '';

const targets = [
  'hunks of',
  'all changes to',
  'all changes to the below files'
];

targets.forEach(t => {
  console.log(`\n=== Target: "${t}" ===`);
  console.log(`main.js index:`, mainContent.indexOf(t));
  console.log(`workbench.desktop.main.js index:`, wbContent.indexOf(t));
});
