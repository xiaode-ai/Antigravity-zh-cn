import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';

function walkAndSearch(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      walkAndSearch(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.css')) {
      // 排除备份文件以避免重复
      if (file.endsWith('.bak')) return;
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const regexes = [
        /limited\s*time/gi,
        /Limited-time/gi,
        /Open Antigravity IDE User Settings/gi,
        /Antigravity - Settings/gi,
        /Quick Settings Panel/gi
      ];

      regexes.forEach(regex => {
        let match;
        while ((match = regex.exec(content)) !== null) {
          const idx = match.index;
          const start = Math.max(0, idx - 150);
          const end = Math.min(content.length, idx + match[0].length + 150);
          const snippet = content.substring(start, end).replace(/\r?\n/g, ' ');
          console.log(`[FOUND] file: ${fullPath}`);
          console.log(`  Pattern: ${regex.toString()}`);
          console.log(`  Index: ${idx}`);
          console.log(`  Snippet: ... ${snippet} ...\n`);
        }
      });
    }
  });
}

console.log('Searching for target phrases in all files under out/');
walkAndSearch(outDir);
console.log('Done searching.');
