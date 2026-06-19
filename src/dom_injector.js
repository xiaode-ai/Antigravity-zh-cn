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

  // ---------- 校验双引号的转义反斜杠数量 ----------
  // 在内存中，合法的 key 和 value 双引号前必须有且仅有 1 个转义反斜杠（\"），即非成对反斜杠。
  // 任何 3 个或更多反斜杠（如 \\\"）都会在浏览器端被解析为额外的物理反斜杠，导致 SyntaxError 语法错误。
  const escapeRegex = /(\\*)"/g;
  let escapeMatch;
  while ((escapeMatch = escapeRegex.exec(dictBody)) !== null) {
    const backslashes = escapeMatch[1];
    if (backslashes.length !== 1) {
      throw new Error(
        `检测到非法的转义反斜杠数量：在双引号 (") 前发现了 ${backslashes.length} 个反斜杠。` +
        `正确的转义格式必须是且仅有 1 个反斜杠（例如 \\" 键值包裹）。` +
        `非法的上下文片段："...${dictBody.substring(Math.max(0, escapeMatch.index - 30), Math.min(dictBody.length, escapeMatch.index + 30))}..."`
      );
    }
  }

  // ---------- 校验是否干涉了 DOM 样式 (确保仅翻译文本) ----------
  const hasStyleChange = /\.style\b/g.test(entry.new) || 
                         /setAttribute\s*\(\s*['"]style['"]/g.test(entry.new) ||
                         /classList\b/g.test(entry.new) ||
                         /className\b/g.test(entry.new);
  
  if (hasStyleChange) {
    throw new Error(
      `[CRITICAL ERROR] 检测到汉化注入脚本中包含修改 DOM 元素样式的逻辑！\n` +
      `为保证显示样式与官方原版 100% 一致，汉化必须仅翻译文本，禁止修改 style/classList/className。`
    );
  }

  // 每个键值对由 4 个转义引号界定：\"key\":\"value\"
  const escapedQuotes = (dictBody.match(/\\"/g) || []).length;
  const entryCount = Math.floor(escapedQuotes / 4);

  console.log(
    '[OK] DOM 注入字典同步完成：' + entryCount + ' 个键值对，' +
    '注入脚本总长 ' + entry.new.length + ' 字符。'
  );
}
