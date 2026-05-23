import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(fullPath, fileList);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.js' || ext === '.json' || ext === '.html') {
        fileList.push({
          path: fullPath,
          size: stat.size
        });
      }
    }
  }
  return fileList;
}

const list = walk(appDir);
console.log(`Total JS/JSON/HTML files: ${list.length}`);
list.sort((a, b) => b.size - a.size);
console.log('\nTop 30 largest files:');
list.slice(0, 30).forEach(f => {
  console.log(` - ${f.path.substring(appDir.length)} (${(f.size / 1024 / 1024).toFixed(2)} MB)`);
});
