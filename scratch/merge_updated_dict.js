import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const translationsPath = path.join(projectRoot, 'translations.json');
const updatedDictPath = path.join(__dirname, 'current_dict.json');

const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
const updatedDict = JSON.parse(fs.readFileSync(updatedDictPath, 'utf8'));

// 找到 DOM 注入条目
const domEntryIdx = translations.findIndex(t => t.old === 'void win.loadURL(url);');
if (domEntryIdx === -1) {
  console.error('未找到 DOM 注入条目');
  process.exit(1);
}

const domEntry = translations[domEntryIdx];
let content = domEntry.new;

// 提取 dictionary 对象位置
const dictStartMarker = 'const dictionary = {';
const dictStartIdx = content.indexOf(dictStartMarker);
const dictEndIdx = content.indexOf('};', dictStartIdx);

if (dictStartIdx === -1 || dictEndIdx === -1) {
  console.error('无法定位 dictionary 边界');
  process.exit(1);
}

function escapeDictValue(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

// 构建新的字典体
const newDictEntries = Object.entries(updatedDict).map(([k, v]) => {
  return `\\"${escapeDictValue(k)}\\":\\"${escapeDictValue(v)}\\"`;
});

const newDictBody = newDictEntries.join(',');

// 重建内容
const beforeDict = content.substring(0, dictStartIdx + dictStartMarker.length);
const afterDict = content.substring(dictEndIdx);
const newContent = beforeDict + newDictBody + afterDict;

// 更新 DOM 注入条目
translations[domEntryIdx].new = newContent;

// 添加静态替换条目用于 ideInstall 向导
const staticReplacements = [
  { old: '<title>Welcome to Antigravity</title>', new: '<title>欢迎使用 Antigravity</title>' },
  { old: '<html lang="en">', new: '<html lang="zh-CN">' },
  { old: 'Antigravity has been redesigned to put agents first with new capabilities. If you\'d still like a code editor, you can download it as a separate app named <b>Antigravity IDE</b>.', new: 'Antigravity 经过重新设计，以智能体为核心并提供全新功能。如果您仍需要代码编辑器，可以下载名为 <b>Antigravity IDE</b> 的独立应用。' },
  { old: 'alt="Antigravity Icon"', new: 'alt="Antigravity 图标"' },
];

let addedStatic = 0;
for (const rep of staticReplacements) {
  const exists = translations.some(t => t.old === rep.old);
  if (!exists) {
    translations.push(rep);
    addedStatic++;
    console.log(`✅ 添加静态替换: "${rep.old.substring(0, 60)}..."`);
  }
}

// 写回文件
fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log(`\n✅ 合并完成！`);
console.log(`   - DOM 字典条目数: ${Object.keys(updatedDict).length}`);
console.log(`   - 新增静态替换条目: ${addedStatic}`);
