import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const outputLines = [];
function log(msg) {
  console.log(msg);
  outputLines.push(msg);
}

log('=== 深入抓取 qne 组件内部实现 ===');

// 1. 抓取 qne 声明处的完整代码段
const qneIdx = content.indexOf('var qne=');
if (qneIdx !== -1) {
  log(`\n[FOUND] "var qne=" 在索引 ${qneIdx}:`);
  log(content.substring(qneIdx, qneIdx + 2000));
} else {
  log('\n[NOT FOUND] "var qne="');
}

// 2. 抓取处 #2 (索引 9855661) 附近的完整上下文
const idx2 = 9855661;
log(`\n[FETCH] 处 #2 (索引 ${idx2}) 前后代码:`);
log(content.substring(idx2 - 300, idx2 + 1000));

// 3. 抓取处 #3 (索引 9857712) 附近的完整上下文
const idx3 = 9857712;
log(`\n[FETCH] 处 #3 (索引 ${idx3}) 前后代码:`);
log(content.substring(idx3 - 300, idx3 + 1000));

fs.writeFileSync('scratch/search_results.txt', outputLines.join('\n'), 'utf8');
log('\n[DONE] 抓取完成，结果写入 scratch/search_results.txt');
