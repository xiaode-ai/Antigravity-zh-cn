/**
 * dom_injector.js — DOM 注入汉化脚本同步模块
 *
 * 负责在翻译流程中维护 translations.json 里的 DOM 注入条目：
 *   - DOM_INJECTION_OLD：注入条目的 old 值标识符
 *   - syncDomInjectionTranslation(translations)：校验并同步注入条目完整性
 */

export const DOM_INJECTION_OLD = 'void win.loadURL(url);';

/**
 * 同步 DOM 注入汉化条目，确保 Web UI 运行时字典完整且结构正确。
 *
 * 在 translateDesktop 流程中被调用（应用翻译之前），职责：
 *   1. 定位 translations 数组中的 DOM 注入条目
 *   2. 校验其 new 值包含有效的 dictionary 对象和注入逻辑
 *   3. 统计并报告字典条目数
 *
 * @param {Array<{old: string, new: string}>} translations - 翻译词库数组（就地修改）
 */
export function syncDomInjectionTranslation(translations) {
  const idx = translations.findIndex(
    (pair) => pair.old === DOM_INJECTION_OLD
  );

  if (idx === -1) {
    console.warn(
      '[WARN] DOM 注入条目未找到（old === "' + DOM_INJECTION_OLD + '"），' +
      'Web UI 运行时翻译将不可用。'
    );
    return;
  }

  const entry = translations[idx];

  // ---------- 结构校验 ----------
  if (!entry.new || typeof entry.new !== 'string') {
    console.error('[ERROR] DOM 注入条目的 new 值为空或非字符串，已跳过同步。');
    return;
  }

  // 检查注入脚本关键结构
  const hasDict = entry.new.includes('const dictionary = {');
  const hasWalker = entry.new.includes('translateTextNode');
  const hasObserver = entry.new.includes('MutationObserver');
  const hasLoadURL = entry.new.includes('void win.loadURL(url);');

  if (!hasDict || !hasWalker || !hasObserver || !hasLoadURL) {
    console.error(
      '[ERROR] DOM 注入脚本结构不完整（' +
      'dictionary:' + hasDict + ', walker:' + hasWalker +
      ', observer:' + hasObserver + ', loadURL:' + hasLoadURL +
      '），可能已损坏。'
    );
    return;
  }

  // ---------- 统计字典条目 ----------
  const dictStartMarker = 'const dictionary = {';
  const dictStartIdx = entry.new.indexOf(dictStartMarker);
  const dictEndIdx = entry.new.indexOf('};', dictStartIdx);

  if (dictStartIdx === -1 || dictEndIdx === -1) {
    console.warn('[WARN] 无法定位 DOM 字典边界，跳过条目统计。');
    return;
  }

  const dictBody = entry.new.substring(
    dictStartIdx + dictStartMarker.length,
    dictEndIdx
  );

  // 每个键值对由 4 个转义引号界定：\"key\":\"value\"
  const escapedQuotes = (dictBody.match(/\\"/g) || []).length;
  const entryCount = Math.floor(escapedQuotes / 4);

  console.log(
    '[OK] DOM 注入字典同步完成：' + entryCount + ' 个键值对，' +
    '注入脚本总长 ' + entry.new.length + ' 字符。'
  );
}
