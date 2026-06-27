import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const translationsPath = path.join(projectRoot, 'translations.json');

console.log('=== 验证 translations.json ===\n');

// 1. 验证 JSON 语法
let translations;
try {
  translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  console.log('✅ JSON 语法正确');
} catch (e) {
  console.error('❌ JSON 语法错误:', e.message);
  process.exit(1);
}

console.log(`   总翻译条目数: ${translations.length}`);

// 2. 验证 DOM 注入条目
const domEntryIdx = translations.findIndex(t => t.old === 'void win.loadURL(url);');
if (domEntryIdx === -1) {
  console.error('❌ 未找到 DOM 注入条目');
  process.exit(1);
}
console.log('✅ 找到 DOM 注入条目');

const domEntry = translations[domEntryIdx];
const content = domEntry.new;

// 3. 验证字典结构
const hasDict = content.includes('const dictionary = {');
const hasWalker = content.includes('translateTextNode');
const hasObserver = content.includes('MutationObserver');
const hasLoadURL = content.includes('void win.loadURL(url);');

console.log(`   字典声明: ${hasDict ? '✅' : '❌'}`);
console.log(`   DOM 遍历器: ${hasWalker ? '✅' : '❌'}`);
console.log(`   MutationObserver: ${hasObserver ? '✅' : '❌'}`);
console.log(`   loadURL 调用: ${hasLoadURL ? '✅' : '❌'}`);

if (!hasDict || !hasWalker || !hasObserver || !hasLoadURL) {
  console.error('❌ DOM 注入脚本结构不完整');
  process.exit(1);
}

// 4. 提取并验证字典
const dictStartMarker = 'const dictionary = {';
const dictStartIdx = content.indexOf(dictStartMarker);
const dictEndIdx = content.indexOf('};', dictStartIdx);

if (dictStartIdx === -1 || dictEndIdx === -1) {
  console.error('❌ 无法定位字典边界');
  process.exit(1);
}

const dictBody = content.substring(dictStartIdx + dictStartMarker.length, dictEndIdx);

try {
  const dict = new Function(`return {${dictBody.replace(/\\"/g, '"').replace(/\\\\/g, '\\')}}`)();
  const keys = Object.keys(dict);
  console.log(`✅ 字典解析成功，共 ${keys.length} 个条目`);
  
  // 验证新增的条目
  const expectedKeys = [
    "There was an unexpected issue setting up your account.",
    "Continue with different account",
    "Having trouble? Let us know",
    "Welcome to Antigravity",
    "Continue with Google",
    "Use Google Cloud project instead",
    "Awaiting Authentication...",
    "Previous",
    "Setting up…",
    "Welcome to the new Antigravity!",
    "Explore the new Antigravity",
    "Download the Antigravity IDE",
    "Antigravity Icon"
  ];
  
  console.log('\n=== 验证新增翻译条目 ===');
  let allFound = true;
  for (const key of expectedKeys) {
    if (key in dict) {
      console.log(`✅ "${key.substring(0, 50)}..." -> "${dict[key]}"`);
    } else {
      console.log(`❌ 未找到: "${key}"`);
      allFound = false;
    }
  }
  
  // 5. 验证转义正确性
  console.log('\n=== 验证转义正确性 ===');
  const escapeRegex = /(\\*)"/g;
  let escapeMatch;
  let escapeError = false;
  while ((escapeMatch = escapeRegex.exec(dictBody)) !== null) {
    const backslashes = escapeMatch[1];
    if (backslashes.length !== 1) {
      console.error(`❌ 非法转义: 在双引号前发现 ${backslashes.length} 个反斜杠`);
      escapeError = true;
      break;
    }
  }
  if (!escapeError) {
    console.log('✅ 所有双引号转义正确（单个反斜杠）');
  }
  
  // 6. 验证没有样式修改代码
  console.log('\n=== 验证无样式修改代码 ===');
  const hasStyleChange = /\.style\b/g.test(content) || 
                         /setAttribute\s*\(\s*['"]style['"]/g.test(content) ||
                         /classList\b/g.test(content) ||
                         /className\b/g.test(content);
  if (hasStyleChange) {
    console.log('⚠️  警告: 检测到可能的样式修改代码');
  } else {
    console.log('✅ 未检测到样式修改代码（仅翻译文本）');
  }
  
  console.log('\n=== 验证完成 ===');
  if (allFound && !escapeError) {
    console.log('🎉 所有验证通过！');
  } else {
    console.log('⚠️  存在一些问题需要检查');
    process.exit(1);
  }
  
} catch (e) {
  console.error('❌ 字典解析失败:', e.message);
  process.exit(1);
}

// 7. 验证静态替换条目
console.log('\n=== 验证静态替换条目 ===');
const staticReplacements = [
  '<title>Welcome to Antigravity</title>',
  '<html lang="en">',
  'Antigravity has been redesigned to put agents first with new capabilities. If you\'d still like a code editor, you can download it as a separate app named <b>Antigravity IDE</b>.',
  'alt="Antigravity Icon"'
];

for (const key of staticReplacements) {
  const found = translations.some(t => t.old === key);
  console.log(`${found ? '✅' : '❌'} 静态替换: "${key.substring(0, 60)}..."`);
}
