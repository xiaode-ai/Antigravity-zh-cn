import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(walk(fullPath));
      }
    } else {
      if (file.toLowerCase().includes('nls.messages')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

console.log('Finding all NLS files in resources/app...');
const files = walk(appDir);
files.forEach(f => {
  console.log(`- ${f}`);
});
