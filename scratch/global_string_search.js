import fs from 'fs';
import path from 'path';

const searchDirectories = [
  'C:\\Users\\i-cgh\\.gemini',
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE'
];

const searchTerm = 'Using the Antigravity Python SDK to build';

function searchInDir(dir) {
  let results = [];
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      
      // 忽略不需要的目录以提升速度
      if (file === 'node_modules' || file === '.git' || file === 'cache' || file === 'Cache' || file === 'logs') {
        continue;
      }
      
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      
      if (stat.isDirectory()) {
        results = results.concat(searchInDir(fullPath));
      } else if (stat.isFile()) {
        // 忽略二进制文件
        const ext = path.extname(fullPath).toLowerCase();
        if (['.exe', '.dll', '.png', '.jpg', '.gif', '.zip', '.tar', '.gz', '.db', '.dat'].includes(ext)) {
          continue;
        }
        
        // 限制文件大小在 20MB 以内
        if (stat.size > 20 * 1024 * 1024) {
          continue;
        }
        
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes(searchTerm)) {
            console.log(`[MATCH] 找到匹配文件: ${fullPath}`);
            results.push(fullPath);
          }
        } catch (e) {
          // 读取失败忽略
        }
      }
    }
  } catch (e) {
    // 目录读取失败忽略
  }
  return results;
}

console.log(`正在启动全局深度搜索，关键词: "${searchTerm}" ...`);
const matchedFiles = [];
searchDirectories.forEach(dir => {
  console.log(`正在搜索目录: ${dir}`);
  const res = searchInDir(dir);
  matchedFiles.push(...res);
});

console.log('\n================ 搜索完成 ================');
console.log(`共找到 ${matchedFiles.length} 个匹配文件：`);
matchedFiles.forEach(f => console.log(`- ${f}`));
