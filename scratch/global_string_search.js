import fs from 'fs';
import path from 'path';

const searchDirectories = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app'
];

const searchTerms = [
  'Already recording',
  'No active recording',
  'Recording...'
];

function searchInDir(dir) {
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
        searchInDir(fullPath);
      } else if (stat.isFile()) {
        // 忽略二进制文件
        const ext = path.extname(fullPath).toLowerCase();
        if (['.exe', '.dll', '.png', '.jpg', '.gif', '.zip', '.tar', '.gz', '.db', '.dat', '.map'].includes(ext)) {
          continue;
        }
        
        // 限制文件大小在 20MB 以内
        if (stat.size > 20 * 1024 * 1024) {
          continue;
        }
        
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          searchTerms.forEach(term => {
            if (content.includes(term)) {
              console.log(`[MATCH] 找到 "${term}" 在文件: ${fullPath}`);
              let idx = 0;
              while (true) {
                idx = content.indexOf(term, idx);
                if (idx === -1) break;
                const start = Math.max(0, idx - 100);
                const end = Math.min(content.length, idx + term.length + 100);
                console.log(`  Context at pos ${idx}: ${content.substring(start, end).replace(/\r?\n/g, ' ')}`);
                idx += term.length;
              }
            }
          });
        } catch (e) {
          // 读取失败忽略
        }
      }
    }
  } catch (e) {
    // 目录读取失败忽略
  }
}

console.log(`正在启动全局深度搜索，关键词: ${JSON.stringify(searchTerms)} ...`);
searchDirectories.forEach(dir => {
  searchInDir(dir);
});
console.log('搜索完成。');
