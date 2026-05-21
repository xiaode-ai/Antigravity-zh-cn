import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const searchTerms = [
  'Build with Antigravity IDE Plugins',
  'Plugins are packaged collections of skills',
  'Core tools and knowledge required to develop for Android',
  'Modern Web Guidance',
  'Keep your coding agent up to date with the latest web best practices',
  'Google Antigravity SDK',
  'Using the Antigravity Python SDK to build AI agents',
  'Curated collection of agent skills for science',
  'Firebase',
  'Prototype, build & run modern apps users love',
  'Chrome DevTools',
  'Reliable automation, in-depth debugging, and performance analysis in Chrome'
];

const outputLines = [];
function log(msg) {
  console.log(msg);
  outputLines.push(msg);
}

searchTerms.forEach(term => {
  log(`\n=================== 搜索关键词: "${term}" ===================`);
  let idx = -1;
  let count = 0;
  while ((idx = content.indexOf(term, idx + 1)) !== -1) {
    count++;
    log(`\n[FOUND #${count}] 索引位置: ${idx}`);
    // 截取前后 300 字符
    const start = Math.max(0, idx - 300);
    const end = Math.min(content.length, idx + term.length + 300);
    log(content.substring(start, end));
    
    if (count >= 10) {
      log('... (匹配过多，截断显示)');
      break;
    }
  }
  if (count === 0) {
    log(`[NOT FOUND] 未找到关键词 "${term}"`);
  }
});

fs.writeFileSync('scratch/search_results.txt', outputLines.join('\n'), 'utf8');
log('\n[DONE] 结果已写入 scratch/search_results.txt');
