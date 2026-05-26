import fs from 'fs';

const content = fs.readFileSync('temp_debug_main.js', 'utf8');

// 匹配包含 Loading 或 loading 的双引号、单引号或反引号字符串，或者 JSX 字符串
const regexes = [
  /["'`][^"'`]*?loading[^"'`]*?["'`]/gi,
  /children:\s*["'`][^"'`]*?loading[^"'`]*?["'`]/gi,
  /children:\s*\[[^\]]*?loading[^\]]*?\]/gi
];

console.log("--- 搜索 Loading 关键词 ---");
let index = 0;
let match;

// 我们用简易的 substring 来做，直接寻找所有 "Loading"、"loading" 的出现位置，并截取其前后各 100 个字符
let pos = 0;
while ((pos = content.indexOf('Loading', pos)) !== -1) {
  const start = Math.max(0, pos - 150);
  const end = Math.min(content.length, pos + 150);
  console.log(`\n[Match ${++index}] 位置: ${pos}`);
  console.log(content.substring(start, end).replace(/\n/g, ' '));
  pos += 7;
}

pos = 0;
while ((pos = content.indexOf('loading', pos)) !== -1) {
  const start = Math.max(0, pos - 150);
  const end = Math.min(content.length, pos + 150);
  console.log(`\n[Match-low ${++index}] 位置: ${pos}`);
  console.log(content.substring(start, end).replace(/\n/g, ' '));
  pos += 7;
}
