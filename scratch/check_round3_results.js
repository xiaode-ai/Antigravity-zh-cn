import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
if (!fs.existsSync(mainPath)) {
  console.error("Error: main.js not found at " + mainPath);
  process.exit(1);
}

const content = fs.readFileSync(mainPath, 'utf8');

const checks = [
  { term: '使用本应用即表示您同意其', expected: true },
  { term: '高级设置', expected: true },
  { term: '启用演示模式（测试版）', expected: true },
  { term: '您的 UI 将进行微调，以确保更一致的演示', expected: true },
  { term: '自定义设置', expected: true },
  { term: '配置默认行为、技能和 MCP 服务端', expected: true },
  { term: '以下分析显示了来自技能、规则和 MCP 等自定义设置的 Token 使用情况', expected: true },
  { term: '的自定义预算额度可用', expected: true },
  { term: '隐藏明细', expected: true },
  { term: '无 MCP 服务端', expected: true },
  { term: 'Build With Google 插件', expected: true },
  { term: '工作区', expected: true },
  { term: '规则', expected: true }
];

console.log("=== Round 3 Translation Validation ===");
let allPassed = true;
for (const item of checks) {
  const found = content.includes(item.term);
  if (found === item.expected) {
    console.log(`[PASS] "${item.term}" is ${found ? 'FOUND' : 'NOT FOUND'} as expected.`);
  } else {
    console.log(`[FAIL] "${item.term}" expected to be ${item.expected ? 'FOUND' : 'NOT FOUND'}, but got ${found ? 'FOUND' : 'NOT FOUND'}.`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log("\n[SUCCESS] All Round 3 terms are verified successfully in main.js!");
} else {
  console.log("\n[WARNING] Some terms were not verified. Please double-check.");
}
