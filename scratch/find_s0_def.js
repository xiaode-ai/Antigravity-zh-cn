import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const backupPath = targetPath + '.bak';
const content = fs.readFileSync(backupPath, 'utf8');

console.log('=== 精细定位 s0 组件定义 ===');

// 我们来找 "s0=" 的所有位置
let pos = 0;
let occurrences = [];
while ((pos = content.indexOf('s0', pos)) !== -1) {
  // 我们只找周围是赋值或声明的 s0
  const snippet = content.substring(Math.max(0, pos - 10), Math.min(content.length, pos + 25));
  if (/var\s+s0|let\s+s0|const\s+s0|=s0|s0=|\bs0\s*=/.test(snippet)) {
    occurrences.push(pos);
  }
  pos += 2;
}

console.log(`共找到疑似 s0 定义/赋值 ${occurrences.length} 处：`);
occurrences.forEach((pIdx, i) => {
  console.log(`- 处 #${i+1} (索引 ${pIdx}):`);
  console.log(content.substring(pIdx - 100, pIdx + 1500));
  console.log('-'.repeat(40));
});
