import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');
const wbContent = fs.readFileSync(wbPath, 'utf8');

const start = 14370000;
const end = 14382000;
const chunk = wbContent.substring(start, end);

// 查找并打印该区域中出现的所有单词 "Snooze", "Start", "Manage" 及其附近的代码
const words = ["Snooze", "Start", "Manage", "Global", "Workspace", "Rules", "Workflows"];
words.forEach(word => {
  let idx = 0;
  console.log(`\n--- Searching for "${word}" inside the customization chunk ---`);
  while (true) {
    const nextIdx = chunk.indexOf(word, idx);
    if (nextIdx === -1) break;
    const absIdx = start + nextIdx;
    const snippet = chunk.substring(Math.max(0, nextIdx - 50), Math.min(chunk.length, nextIdx + word.length + 50));
    console.log(`  At absolute index ${absIdx}: ... ${snippet.replace(/\r?\n/g, ' ')} ...`);
    idx = nextIdx + 1;
  }
});

// 我们也可以把这一整段写入一个调试文件，以便我们离线分析
fs.writeFileSync('scratch/explored_context.txt', chunk, 'utf8');
console.log('\nWrote customization chunk to scratch/explored_context.txt');
