import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainBakPath) ? fs.readFileSync(mainBakPath, 'utf8') : '';
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

function findWorkflows(content, name) {
  if (!content) return;
  console.log(`=== Workflows in ${name} ===`);
  const keywords = ['children:"Workflows"', 'text:"Workflows"', 'label:"Workflows"', 'Workflows'];
  keywords.forEach(keyword => {
    let idx = 0;
    let count = 0;
    while (true) {
      idx = content.indexOf(keyword, idx);
      if (idx === -1) break;
      const context = content.substring(idx - 100, idx + 100);
      if (context.includes('children:"') || context.includes('text:"') || context.includes('label:"')) {
        count++;
        console.log(`  Match ${count} at ${idx}: ${context.replace(/\r?\n/g, ' ')}`);
      }
      idx += keyword.length;
    }
  });
}

findWorkflows(mainContent, 'main.js.bak');
findWorkflows(wbContent, 'workbench.desktop.main.js.bak');
