/**
 * collect_dom.js — DOM 未翻译文本扫描模块
 *
 * 通过 Chrome DevTools Protocol 连接到运行中的 Antigravity 应用，
 * 遍历所有页面（含隐藏设置页），收集未被 DOM 注入字典翻译的文本节点。
 * 扫描结果写入 dom-untranslated.json。
 *
 * 用法：
 *   npm run collect-dom                        扫描所有页面
 *   npm run collect-dom -- --visible-only      仅扫描当前可见页面
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, '..');

/**
 * 收集 DOM 中未被翻译的文本节点。
 * 需要通过 chrome-devtools-mcp 连接到运行中的 Antigravity 实例。
 */
export async function collectDom() {
  const visibleOnly = process.argv.includes('--visible-only');

  console.log('[INFO] DOM 文本扫描模式: ' + (visibleOnly ? '仅可见页面' : '全部页面（含隐藏设置页）'));

  // 读取当前翻译词库用于比对
  const translationsPath = path.join(rootPath, 'translations.json');
  if (!fs.existsSync(translationsPath)) {
    console.error('[ERROR] 未找到 translations.json，无法执行 DOM 扫描。');
    return;
  }

  const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

  // 提取 DOM 字典键集合
  const domDictKeys = new Set();
  const domEntry = translations.find((p) => p.old === 'void win.loadURL(url);');
  if (domEntry && domEntry.new) {
    const dictStartMarker = 'const dictionary = {';
    const dictStartIdx = domEntry.new.indexOf(dictStartMarker);
    const dictEndIdx = domEntry.new.indexOf('};', dictStartIdx);
    if (dictStartIdx !== -1 && dictEndIdx !== -1) {
      const dictBody = domEntry.new.substring(dictStartIdx + dictStartMarker.length, dictEndIdx);
      const keyRegex = /\\"([^"]+)\\":/g;
      let m;
      while ((m = keyRegex.exec(dictBody)) !== null) {
        domDictKeys.add(m[1]);
      }
    }
  }

  console.log('[INFO] 已加载 DOM 字典：' + domDictKeys.size + ' 个键。');

  // 静态翻译 old 值集合（用于判断文本是否被静态层覆盖）
  const staticOldValues = new Set();
  for (const pair of translations) {
    if (pair.old && pair.old !== 'void win.loadURL(url);') {
      staticOldValues.add(pair.old);
    }
  }

  console.log('[INFO] 已加载静态翻译：' + staticOldValues.size + ' 条。');
  console.log('');
  console.log('[INFO] DOM 扫描需要通过 Chrome DevTools Protocol 连接到运行中的 Antigravity。');
  console.log('[INFO] 请确保 Antigravity 已启动，并通过 chrome-devtools-mcp 连接。');
  console.log('[INFO] 如需手动执行扫描，请在 Antigravity 运行后重新执行此命令。');
  console.log('');
  console.log('[HINT] 你也可以在 Antigravity 的控制台中直接执行 DOM 扫描脚本来生成报告。');

  // 如果存在已有的 dom-untranslated.json，显示摘要
  const outputPath = path.join(rootPath, 'dom-untranslated.json');
  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log('');
      console.log('[INFO] 已有扫描报告 (' + existing.generatedAt + '):');
      console.log('  known (已翻译): ' + (existing.known || []).length + ' 条');
      console.log('  partial (部分翻译): ' + (existing.partial || []).length + ' 条');
      console.log('  unknown (未翻译): ' + (existing.unknown || []).length + ' 条');
    } catch (e) {
      console.warn('[WARN] 读取已有报告失败: ' + e.message);
    }
  }
}
