/**
 * Add missing DOM dictionary entries + fix injection timing.
 * 
 * Strategy: Instead of parsing the deeply-nested dictionary string,
 * we insert new entries right before the closing "};" of the dictionary.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const translationsPath = path.join(projectRoot, 'translations.json');

const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
const domEntry = translations.find(t => t.old === 'void win.loadURL(url);');
if (!domEntry) { console.error('FATAL: DOM injection entry not found'); process.exit(1); }

let raw = domEntry.new;

// ── Helper: check if a key exists in the dictionary ──
// In the parsed string, keys appear as \"KEY\" (literal backslash-quote-key-backslash-quote)
function hasKey(k) {
  // Build the search pattern: \"key\":
  const pattern = '\\"' + k + '\\":';
  return raw.includes(pattern);
}

// ── Helper: add a dictionary entry ──
// In the parsed string, we need to insert: ,\"key\":\"value\"
// right before the closing }; of the dictionary
function addEntry(k, v) {
  if (hasKey(k)) {
    console.log(`  SKIP (exists): "${k}"`);
    return false;
  }
  
  // Build the entry string in the parsed-string format
  // We need literal: ,\"key\":\"value\"
  // In the parsed string, \" is a 2-char sequence
  const entry = ',\\"' + k + '\\":\\"' + v + '\\"';
  
  // Find the dictionary closing: }; followed by newline escape
  // In the parsed string, it looks like: };\\n
  // where \\n is a literal 3-char sequence (\, \, n)
  // Actually it's just }; followed by a \\n (backslash-backslash-n in the parsed string)
  // Let me find the exact position
  
  // The dictionary ends with }; somewhere in the string
  // Find "const dictionary = {" first, then find its matching }
  const dictDecl = 'const dictionary = {';
  const dictStart = raw.indexOf(dictDecl);
  if (dictStart === -1) throw new Error('Cannot find dictionary declaration');
  
  let braceDepth = 0;
  let dictEnd = -1;
  const searchFrom = dictStart + dictDecl.length - 1; // position of opening {
  for (let i = searchFrom; i < raw.length; i++) {
    if (raw[i] === '{') braceDepth++;
    else if (raw[i] === '}') {
      braceDepth--;
      if (braceDepth === 0) { dictEnd = i; break; }
    }
  }
  if (dictEnd === -1) throw new Error('Cannot find dictionary end');
  
  // Insert the entry right before the closing }
  raw = raw.slice(0, dictEnd) + entry + raw.slice(dictEnd);
  console.log(`  ADD: "${k}" → "${v}"`);
  return true;
}

// ── Add missing entries ──
console.log('Adding missing dictionary entries:');

const entries = [
  // Environment / Worktree strings (from user report)
  ['Selecting your Environment', '选择你的环境'],
  ['Use the environment selector to switch between working in existing folders and creating new worktrees.', '使用环境选择器在现有文件夹和新建工作树之间切换。'],
  ['worktrees', '工作树'],
  ['Environment', '环境'],
  
  // Delete confirmation dialog fragments
  ['including', '包括'],
  ['active conversations', '个活跃对话'],
  ['archived conversations', '个已归档对话'],
  
  // Strings that ARE in dictionary but may need re-adding due to parse issues
  // (only added if not already present)
  ['Avatar URL', '头像 URL'],
  ['Bot Name', '机器人名称'],
  ['Setup Jetski Chat', '设置 Jetski 聊天'],
  ['Enter bot name (optional)', '输入机器人名称（可选）'],
  ['Enter avatar URL (optional)', '输入头像 URL（可选）'],
  ['Google Drive integration not available', 'Google Drive 集成不可用'],
  ['Describe the bug you encountered...', '描述您遇到的缺陷...'],
  ['Typeahead menu', '自动补全菜单'],
  ['Selection Actions', '选择操作'],
  ['Claude and GPT models', 'Claude 和 GPT 模型'],
  ['Configure a chat bot so you can use Jetski directly from Google Chat.', '配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。'],
  ['Configure a chat bot so you can use Jetski directly from Google Chat. For help, visit go/jetski-chat or join the chat space.', '配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。如需帮助，请访问 go/jetski-chat 或加入聊天空间。'],
  ['For help, visit', '如需帮助，请访问'],
  ['or join the', '或加入'],
  ['chat space', '聊天空间'],
  ['to be installed.', '已安装。'],
  ['We recommend attaching logs. Attaching logs will help the Antigravity team act on and prioritize your feedback.', '我们建议附加日志。附加日志将有助于 Antigravity 团队处理和优先处理您的反馈。'],
  
  // Skill description entries
  ['Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer', '使用 Chrome DevTools 和 Puppeteer 在 Chrome 中进行可靠的自动化、深入调试和性能分析'],
  ['Skills providing tailored instructions for happy path Dart and Flutter development workflows.', '提供针对 Dart 和 Flutter 开发工作流量身定制的技能说明。'],
  ['Core tools and knowledge required to develop for Android', '开发 Android 所需的核心工具和知识'],
  ['Configure editor-specific behaviors and shortcuts.', '配置编辑器特定的行为和快捷键。'],
  ['To modify editor settings, open 设置 within the editor window.', '要修改编辑器设置，请在编辑器窗口中打开设置。'],
  ['Configure tab completion, suggestions, and navigation behavior.', '配置标签页补全、建议和导航行为。'],
  
  // Marketplace entries
  ['Marketplace', '市场'],
  ['Marketplace Gallery URL', '市场画廊 URL'],
  ['Marketplace Item URL', '市场项目 URL'],
  ['Changes the base URL for marketplace search results. You must restart Antigravity to use the new marketplace after changing this value.', '更改市场搜索结果的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。'],
  ['Changes the base URL on each extension page. You must restart Antigravity to use the new marketplace after changing this value.', '更改每个扩展页面的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。'],
  
  // Other
  ['Google Antigravity SDK', 'Google Antigravity SDK'],
  ['Dart and Flutter', 'Dart 和 Flutter'],
  ['Chrome DevTools', 'Chrome DevTools'],
];

let addCount = 0;
for (const [k, v] of entries) {
  if (addEntry(k, v)) addCount++;
}
console.log(`\nAdded ${addCount} new entries.`);

// ── Update timing ──
const oldTiming = '[500, 1500, 3000].forEach(ms => setTimeout(run, ms));';
const newTiming = '[500, 1500, 3000, 5000, 10000, 15000, 30000].forEach(ms => setTimeout(run, ms));';

if (raw.includes(oldTiming)) {
  raw = raw.replace(oldTiming, newTiming);
  console.log('Updated injection timing: added 5s, 10s, 15s, 30s delayed re-walks.');
} else {
  console.log('WARNING: Timing pattern not found, skipping timing update.');
}

// ── Save ──
domEntry.new = raw;

const backupPath = translationsPath + '.bak_before_fix2';
fs.copyFileSync(translationsPath, backupPath);
console.log(`\nBackup: ${backupPath}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Saved translations.json');

// ── Verify ──
const v = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
const vDom = v.find(t => t.old === 'void win.loadURL(url);');
const vRaw = vDom.new;

for (const checkKey of ['Selecting your Environment', 'including', 'active conversations', 'worktrees', 'Environment']) {
  const pattern = '\\"' + checkKey + '\\":';
  console.log(`  ${vRaw.includes(pattern) ? '✓' : '✗'} "${checkKey}"`);
}

// Count total entries (rough)
const dictStart = vRaw.indexOf('const dictionary = {');
let depth = 0, dictEnd = -1;
for (let i = dictStart + 'const dictionary = {'.length - 1; i < vRaw.length; i++) {
  if (vRaw[i] === '{') depth++;
  else if (vRaw[i] === '}') { depth--; if (depth === 0) { dictEnd = i; break; } }
}
const dictBody = vRaw.slice(dictStart + 'const dictionary = '.length + 1, dictEnd);
// Count \" patterns that start a key
const count = (dictBody.match(/\\"[^"\\]*(?:\\.[^"\\]*)*\\":/g) || []).length;
console.log(`\nDictionary now has ~${count} entries.`);

console.log('\nDone! Run: npm run translate');
