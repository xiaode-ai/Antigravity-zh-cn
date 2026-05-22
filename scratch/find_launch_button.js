import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainBakPath = path.join(targetDir, 'jetskiAgent', 'main.js.bak');
const wbBakPath = path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.existsSync(mainBakPath) ? fs.readFileSync(mainBakPath, 'utf8') : '';
const wbContent = fs.existsSync(wbBakPath) ? fs.readFileSync(wbBakPath, 'utf8') : '';

function findLaunch(content, name, btnFunc) {
  if (!content) return;
  console.log(`=== Launch button in ${name} ===`);
  const query = 'children:"Launch"';
  let idx = 0;
  while (true) {
    idx = content.indexOf(query, idx);
    if (idx === -1) break;
    const context = content.substring(idx - 100, idx + 100);
    // filter for button
    if (context.includes(btnFunc) || context.includes('rounded-sm')) {
      console.log(`Index ${idx}:`);
      console.log(context);
    }
    idx += query.length;
  }
}

findLaunch(mainContent, 'main.js.bak', 'button');
findLaunch(wbContent, 'workbench.desktop.main.js.bak', 'button');
