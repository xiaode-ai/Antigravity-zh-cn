import fs from 'fs';
import path from 'path';

const searchDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

function walkDir(dir, pattern, results = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    // 忽略 node_modules 以防止太大，但如果有必要我们之后再看
    if (file === 'node_modules' || file === '.git' || file === 'out-build') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, pattern, results);
    } else {
      if (file.endsWith('.js') || file.endsWith('.json')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(pattern)) {
          results.push(fullPath);
        }
      }
    }
  }
  return results;
}

console.log('Searching for "Enable Antigravity to deploy apps"...');
const results = walkDir(searchDir, 'Enable Antigravity to deploy apps');
console.log('Results:', results);
