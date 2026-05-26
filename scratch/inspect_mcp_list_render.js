import fs from 'fs';

const mainContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak', 'utf8');

const idx = mainContent.indexOf('Search MCP servers by name');
if (idx !== -1) {
  // 打印 idx 之后 4000 个字符
  console.log(mainContent.substring(idx - 100, idx + 4000));
}
