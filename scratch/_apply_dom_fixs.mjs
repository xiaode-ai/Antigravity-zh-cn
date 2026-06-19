// 修复 DOM 字典：添加新条目 + 修正残留英文
import fs from 'fs';

const translationsPath = 'C:/Users/i-cgh/Documents/GitHub/Antigravity-zh-cn/translations.json';

// 备份
const backupPath = translationsPath + '.bak_domfix';
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(translationsPath, backupPath);
  console.log('[OK] 已备份至 ' + backupPath);
} else {
  console.log('[INFO] 备份已存在，跳过');
}

const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

// 找到 DOM 注入条目
const domIdx = translations.findIndex(p => p.old && p.old.includes('void win.loadURL(url);'));
if (domIdx === -1) { console.error('未找到 DOM 注入条目！'); process.exit(1); }

let domNew = translations[domIdx].new;

// 定位字典边界
const dictStartMarker = 'const dictionary = {';
const dictStartIdx = domNew.indexOf(dictStartMarker);
const dictEndIdx = domNew.indexOf('};', dictStartIdx);
if (dictStartIdx === -1 || dictEndIdx === -1) { console.error('无法定位字典边界！'); process.exit(1); }

let dictBody = domNew.substring(dictStartIdx + dictStartMarker.length, dictEndIdx);
console.log('[INFO] 提取字典体，长度: ' + dictBody.length);

// 在 dictBody 中，引号的实际形式是 \" (因为它是 JS 字符串字面量里的内容)
// 即 JSON.parse 后，\" 变为 \" 的原始字符
// 所以搜索/插入时用 \" 作为引号分隔符

const Q = '\\"'; // 这是 dictBody 中实际使用的引号形式

// ========== 1. 修正残留英文的值 ==========
const fixPairs = [
  {
    key: '通过 Model 上下文 Protocol 配置外部工具。',
    oldVal: '通过 Model Context Protocol 配置外部工具。',
    newVal: '通过模型上下文协议配置外部工具。'
  },
  {
    key: 'Configure external tools via Model Context Protocol.',
    oldVal: '通过 Model Context Protocol 配置外部工具。',
    newVal: '通过模型上下文协议配置外部工具。'
  }
];

let fixCount = 0;
for (const fix of fixPairs) {
  const searchStr = Q + fix.key + Q + ':' + Q + fix.oldVal + Q;
  const replaceStr = Q + fix.key + Q + ':' + Q + fix.newVal + Q;
  
  if (dictBody.includes(searchStr)) {
    dictBody = dictBody.replace(searchStr, replaceStr);
    fixCount++;
    console.log('[FIX] "' + fix.key + '" → "' + fix.newVal + '"');
  } else {
    console.log('[WARN] 未找到: "' + fix.key + '"');
  }
}
console.log('\n修正了 ' + fixCount + ' 条残留英文\n');

// ========== 2. 添加新条目 ==========
const newEntries = [
  // 纯英文 UI 字符串
  ['Marketplace', '市场'],
  ['Marketplace Gallery URL', '市场画廊 URL'],
  ['Marketplace Item URL', '市场项目 URL'],
  ['Changes the base URL for marketplace search results. You must restart Antigravity to use the new marketplace after changing this value.', '更改市场搜索结果的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。'],
  ['Changes the base URL on each extension page. You must restart Antigravity to use the new marketplace after changing this value.', '更改每个扩展页面的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。'],
  ['Setup', '设置'],
  ['Setup Jetski Chat', '设置 Jetski 聊天'],
  ['Jetski Chat', 'Jetski 聊天'],
  ['Configure a chat bot so you can use Jetski directly from Google Chat.', '配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。'],
  ['Configure a chat bot so you can use Jetski directly from Google Chat. For help, visit go/jetski-chat or join the chat space.', '配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。如需帮助，请访问 go/jetski-chat 或加入聊天空间。'],
  ['For help, visit', '如需帮助，请访问'],
  ['or join the', '或加入'],
  ['chat space', '聊天空间'],
  ['Bot Name', '机器人名称'],
  ['Avatar URL', '头像 URL'],
  ['Enter bot name (optional)', '输入机器人名称（可选）'],
  ['Enter avatar URL (optional)', '输入头像 URL（可选）'],
  ['Google Drive integration not available', 'Google Drive 集成不可用'],
  ['Claude and GPT models', 'Claude 和 GPT 模型'],
  ['Typeahead menu', '自动补全菜单'],
  ['Selection Actions', '选择操作'],
  ['Dart and Flutter', 'Dart 和 Flutter'],
  // 混合前缀条目（覆盖 DOM 拼接文本）
  ['MCP 工具通过 Model 上下文 Protocol 配置外部工具。', 'MCP 工具通过模型上下文协议配置外部工具。'],
  ['管理 your notification preferences.', '管理您的通知偏好。'],
  ['显示 Selection Actions', '显示选择操作'],
  ['刷新 quota and credits data', '刷新配额和点数数据'],
  ['Actuation 权限', '执行权限'],
  ['Go to 项目', '前往项目'],
];

let addCount = 0;
let skipCount = 0;

for (const [key, value] of newEntries) {
  const searchKey = Q + key + Q + ':';
  if (dictBody.includes(searchKey)) {
    console.log('[SKIP] 已存在: "' + key + '"');
    skipCount++;
    continue;
  }
  
  // 追加到末尾
  const newPair = ',' + Q + key + Q + ':' + Q + value + Q;
  dictBody = dictBody + newPair;
  addCount++;
  console.log('[ADD] "' + key + '" → "' + value + '"');
}

// 特殊处理：Show "Edit" and "Chat" buttons (含转义引号)
const showEditKey = 'Show \\\\"编辑\\\\" and \\\\"Chat\\\\" buttons when selecting text in the editor.';
const showEditVal = '在编辑器中选择文本时显示\\\\"编辑\\\\"和\\\\"对话\\\\"按钮。';
const showEditSearch = Q + showEditKey + Q + ':';
if (!dictBody.includes(showEditSearch)) {
  const newPair = ',' + Q + showEditKey + Q + ':' + Q + showEditVal + Q;
  dictBody = dictBody + newPair;
  addCount++;
  console.log('[ADD] Show "编辑" and "Chat" buttons... → 在编辑器中选择文本时显示"编辑"和"对话"按钮。');
} else {
  console.log('[SKIP] Show "编辑" and "Chat" buttons... 已存在');
  skipCount++;
}

console.log('\n新增 ' + addCount + ' 条，跳过 ' + skipCount + ' 条\n');

// ========== 3. 重新组装 ==========
const newDomNew = domNew.substring(0, dictStartIdx + dictStartMarker.length) + dictBody + domNew.substring(dictEndIdx);
translations[domIdx].new = newDomNew;

// ========== 4. 验证 ==========
// 统计键值对数
const kvRegex = new RegExp(Q.replace(/\\/g, '\\\\') + '[^"]+' + Q.replace(/\\/g, '\\\\') + ':' + Q.replace(/\\/g, '\\\\'), 'g');
const matchCount = (dictBody.match(kvRegex) || []).length;
console.log('[VERIFY] 字典最终包含约 ' + matchCount + ' 个键值对');

// 关键条目检查
const testKeys = [
  'Marketplace',
  'Jetski Chat',
  'Claude and GPT models',
  'Selection Actions',
  'Actuation 权限',
  'MCP 工具通过 Model 上下文 Protocol 配置外部工具。',
  'Setup',
  'Setup Jetski Chat',
  'Bot Name',
  'Avatar URL',
  'Typeahead menu',
  'Dart and Flutter',
  'Go to 项目',
  '管理 your notification preferences.',
  '刷新 quota and credits data'
];

console.log('\n[VERIFY] 关键条目检查:');
let allOk = true;
for (const k of testKeys) {
  if (dictBody.includes(Q + k + Q + ':')) {
    console.log('  ✅ "' + k + '"');
  } else {
    console.log('  ❌ "' + k + '" 未找到！');
    allOk = false;
  }
}

// 验证修正后的值
console.log('\n[VERIFY] 修正值检查:');
for (const fix of fixPairs) {
  if (dictBody.includes(Q + fix.key + Q + ':' + Q + fix.newVal + Q)) {
    console.log('  ✅ "' + fix.key + '" → "' + fix.newVal + '"');
  } else {
    console.log('  ❌ "' + fix.key + '" 修正未生效！');
    allOk = false;
  }
}

// ========== 5. 写回 ==========
fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('\n[OK] translations.json 已成功更新！');
console.log('[INFO] 备份: ' + backupPath);

// 验证 JSON 可重新解析
try {
  JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  console.log('[OK] JSON 语法验证通过');
} catch (e) {
  console.error('[CRITICAL] JSON 语法错误: ' + e.message);
  process.exit(1);
}
