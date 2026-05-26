import fs from 'fs';
import path from 'path';

const searchDirs = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app',
  'C:\\Users\\i-cgh\\.gemini\\config\\plugins'
];

// 使用递归查找，对每个目录下的所有文件（包括 node_modules，但限制只对特定后缀或者小于 5MB 的文件读取）进行搜索
function searchForText(dir, text, results = []) {
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === '.git' || file === 'out-build') continue;
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        searchForText(fullPath, text, results);
      } else {
        if (stat.size < 10 * 1024 * 1024) { // 只读小于 10MB 的文件
          // 仅检查 js, json, md, txt, cjs, mjs
          const ext = path.extname(file).toLowerCase();
          if (['.js', '.json', '.md', '.txt', '.cjs', '.mjs', '.ts', '.yaml', '.yml'].includes(ext)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(text)) {
              results.push(fullPath);
            }
          }
        }
      }
    } catch (e) {
      // 忽略无法读取的文件夹/文件
    }
  }
  return results;
}

console.log('Searching for "Bigtable Admin"...');
const results1 = [];
searchDirs.forEach(dir => searchForText(dir, 'Bigtable Admin', results1));
console.log('Bigtable Admin results:', results1);

console.log('\nSearching for "AlloyDB"...');
const results2 = [];
searchDirs.forEach(dir => searchForText(dir, 'AlloyDB', results2));
console.log('AlloyDB results:', results2);
