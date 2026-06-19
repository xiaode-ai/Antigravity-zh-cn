/**
 * Add 12 settings-page translation entries to DOM injection dictionary.
 * For "about": uses longer context "about Full machine" to avoid false matches.
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

// ── Helper: check if a key exists ──
function hasKey(k) {
  return raw.includes('\\"' + k + '\\":');
}

// ── Helper: add entry before dictionary closing } ──
function addEntry(k, v) {
  if (hasKey(k)) {
    console.log(`  SKIP (exists): "${k}"`);
    return false;
  }
  
  const entry = ',\\"' + k + '\\":\\"' + v + '\\"';
  
  // Find dictionary closing }
  const dictDecl = 'const dictionary = {';
  const dictStart = raw.indexOf(dictDecl);
  let braceDepth = 0, dictEnd = -1;
  for (let i = dictStart + dictDecl.length - 1; i < raw.length; i++) {
    if (raw[i] === '{') braceDepth++;
    else if (raw[i] === '}') { braceDepth--; if (braceDepth === 0) { dictEnd = i; break; } }
  }
  if (dictEnd === -1) throw new Error('Cannot find dictionary end');
  
  raw = raw.slice(0, dictEnd) + entry + raw.slice(dictEnd);
  console.log(`  ADD: "${k}" → "${v}"`);
  return true;
}

console.log('Adding settings page translations:');

const entries = [
  // 1. Security preset descriptions
  ['Requires manual review for all terminal commands and file accesses outside of the working folders.',
   '所有终端命令和工作文件夹之外的文件访问均需要手动审核。'],
  
  // 2. Full machine preset name
  ['Full machine', '完全访问'],
  
  // 3. Full machine preset description
  ['All terminal commands require review. The agent can read or write to any file in the machine.',
   '所有终端命令均需审核。智能体可读写机器上的任何文件。'],
  
  // 4. Turbo mode preset name
  ['Turbo mode', '极速模式'],
  
  // 5. Turbo mode description
  ['Disables all safety barriers for maximal iteration velocity.',
   '禁用所有安全屏障，以实现最大迭代速度。'],
  
  // 6. "about" — use longer context to avoid false matches
  //    Instead of bare "about", use "about Full machine" → "关于完全访问"
  ['about Full machine', '关于完全访问'],
  //    Also add "about Turbo mode" for completeness
  ['about Turbo mode', '关于极速模式'],
  
  // 7-11. Hybrid entries (already Chinese, ensure they exist)
  ['智能体设置', '智能体设置'],
  ['智能体行为', '智能体行为'],
  ['安全预设', '安全预设'],
  ['本地权限', '本地权限'],
  ['产物审核策略', '产物审核策略'],
  
  // 12. Model Selection
  ['Model Selection', '模型选择'],
];

let addCount = 0;
for (const [k, v] of entries) {
  if (addEntry(k, v)) addCount++;
}
console.log(`\nAdded ${addCount} new entries.`);

// ── Save ──
domEntry.new = raw;

const backupPath = translationsPath + '.bak_before_settings';
fs.copyFileSync(translationsPath, backupPath);
console.log(`Backup: ${backupPath}`);

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log('Saved translations.json');

// ── Verify all 12 target keys exist ──
console.log('\nVerification:');
const verifyKeys = [
  'Requires manual review for all terminal commands',
  'Full machine',
  'All terminal commands require review',
  'Turbo mode',
  'Disables all safety barriers',
  'about Full machine',
  '智能体设置',
  '智能体行为',
  '安全预设',
  '本地权限',
  '产物审核策略',
  'Model Selection',
];
const vRaw = JSON.parse(fs.readFileSync(translationsPath, 'utf8'))
  .find(t => t.old === 'void win.loadURL(url);').new;
let allOk = true;
for (const k of verifyKeys) {
  const ok = vRaw.includes('\\"' + k + '\\":');
  console.log(`  ${ok ? '✓' : '✗'} "${k}"`);
  if (!ok) allOk = false;
}
console.log(allOk ? '\nAll entries verified.' : '\nSome entries FAILED verification!');
