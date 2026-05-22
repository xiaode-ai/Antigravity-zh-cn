import fs from 'fs';
import path from 'path';

const files = [
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak',
  'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  let idx = 0;
  
  // 查找包含 quota, limit, time 的拼装代码
  const searchTerms = ['quota', 'limit'];
  searchTerms.forEach(term => {
    idx = 0;
    let count = 0;
    while ((idx = content.toLowerCase().indexOf(term, idx)) !== -1) {
      // 排除混淆或协议类字段
      const snippet = content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + term.length + 100));
      if (!snippet.includes('delimited') && !snippet.includes('Delimited') && !snippet.includes('LimitInMem') && !snippet.includes('LIMIT_')) {
        count++;
        if (count < 20) {
          console.log(`[${path.basename(filePath)}] Found "${term}" context:`);
          console.log(`  ... ${snippet.replace(/\r?\n/g, ' ')} ...`);
        }
      }
      idx += term.length;
    }
  });
});
