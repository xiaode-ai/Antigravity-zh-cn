import fs from 'fs';
import path from 'path';

const workbenchBak = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak";
const content = fs.readFileSync(workbenchBak, 'utf8');

// 查找包含 clone 且在 label 中的所有 React 渲染片段
let pos = 0;
while ((pos = content.toLowerCase().indexOf("label:", pos)) !== -1) {
  const segment = content.substring(pos, pos + 100);
  if (segment.toLowerCase().includes("clone")) {
    console.log(`▶ Pos: ${pos} => "${segment}"`);
  }
  pos += 6;
}

// 查找 "Clone Repository" 字面量在 vs/workbench/workbench.desktop.main.js.bak 的所有出现位置
let pos2 = 0;
while ((pos2 = content.toLowerCase().indexOf("clone repository", pos2)) !== -1) {
  const start = Math.max(0, pos2 - 100);
  const end = Math.min(content.length, pos2 + 150);
  console.log(`▶ Pos2: ${pos2}`);
  console.log(`  Context: ...${content.substring(start, end).replace(/\n/g, ' ')}...`);
  pos2 += 16;
}
