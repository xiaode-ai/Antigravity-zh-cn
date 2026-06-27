import fs from 'fs';
import asar from 'asar';
import { validateEncoding, detectGarbledText } from './safe_guard.js';

function extractAllVariables(str) {
  if (!str) return [];
  const variables = new Set();

  // 提取 ${var} 模板插值
  const templateRegex = /\$\{\s*([a-zA-Z0-9_\.]+)\s*\}/g;
  let match;
  while ((match = templateRegex.exec(str)) !== null) {
    variables.add(match[0]);
  }

  // 提取 ICU / 普通花括号 {var} {0} 等
  const braceRegex = /\{([a-zA-Z0-9_\.]+)\}/g;
  let bMatch;
  while ((bMatch = braceRegex.exec(str)) !== null) {
    variables.add(bMatch[0]);
  }

  return Array.from(variables);
}

function scanDesktop(config, translationsPath) {
  console.log('[INFO] 正在启动 Antigravity 桌面端 i18nt 扫描器...');

  if (!fs.existsSync(translationsPath)) {
    console.error('[ERROR] 找不到词库文件: "' + translationsPath + '"');
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }

  const { asarPath, filesToTranslate = ['dist/main.js', 'dist/menu.js', 'dist/updater.js', 'dist/tray.js', 'dist/ipcHandlers.js', 'dist/loadingOverlay.js'] } = config;
  const backupPath = asarPath + '.bak';
  const sourceAsar = fs.existsSync(backupPath) ? backupPath : asarPath;

  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  } catch (err) {
    console.error('[CRITICAL] 词库 JSON 格式异常，无法解析:', err.message);
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }

  if (!Array.isArray(rawData)) {
    console.error('[ERROR] 词库格式不符合要求，必须为 [{old, new}] 数组形式。');
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }

  const translations = rawData.map(pair => ({
    old: typeof pair.old === 'string' ? pair.old.trim() : pair.old,
    new: typeof pair.new === 'string' ? pair.new.trim() : pair.new
  }));

  // ---------- DOM 注入字典转义安全校验 ----------
  const domEntry = translations.find(t => t.old === 'void win.loadURL(url);');
  if (domEntry) {
    if (domEntry.new && typeof domEntry.new === 'string') {
      const dictStartMarker = 'const dictionary = {';
      const dictStartIdx = domEntry.new.indexOf(dictStartMarker);
      const dictEndIdx = domEntry.new.indexOf('};', dictStartIdx);
      if (dictStartIdx !== -1 && dictEndIdx !== -1) {
        const dictBody = domEntry.new.substring(
          dictStartIdx + dictStartMarker.length,
          dictEndIdx
        );
        const escapeRegex = /(\\*)"/g;
        let escapeMatch;
        while ((escapeMatch = escapeRegex.exec(dictBody)) !== null) {
          const backslashes = escapeMatch[1];
          if (backslashes.length !== 1) {
            console.error(
              `\x1b[31m[CRITICAL] 检测到非法的转义反斜杠数量：在双引号 (") 前发现了 ${backslashes.length} 个反斜杠。\x1b[0m`
            );
            console.error(
              `正确的转义格式必须是且仅有 1 个反斜杠（例如 \\" 键值包裹）。`
            );
            console.error(
              `非法的上下文片段："...${dictBody.substring(Math.max(0, escapeMatch.index - 30), Math.min(dictBody.length, escapeMatch.index + 30))}..."`
            );
            return { success: false, errorsCount: 1, warningsCount: 0 };
          }
        }
      }
    }
  }

  // 编码一致性校验
  console.log('[SAFEGUARD] 正在执行词库文件编码校验...');
  const encodingResult = validateEncoding(translationsPath);
  if (!encodingResult.valid) {
    console.error('[SAFEGUARD] ❌ 词库文件编码校验未通过：' + encodingResult.error);
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }
  console.log('[SAFEGUARD] ✅ 词库文件编码校验通过 (UTF-8)。');

  // 乱码检测
  console.log('[SAFEGUARD] 正在执行词库乱码深度扫描...');
  const garbledResult = detectGarbledText(translations);
  if (!garbledResult.clean) {
    console.error('[SAFEGUARD] ❌ 词库中检测到 ' + garbledResult.errors.length + ' 处乱码文本！');
    garbledResult.errors.forEach(err => {
      console.error('  ▶ [索引 ' + err.index + '] "' + err.text + '..."');
      console.error('    原因: ' + err.reason);
    });
    return { success: false, errorsCount: garbledResult.errors.length, warningsCount: 0 };
  }
  console.log('[SAFEGUARD] ✅ 词库乱码扫描通过。');

  // 宿主大文件残余英文覆盖审计
  let errorsCount = 0;
  let warningsCount = 0;
  const warnings = [];
  const hostWarnings = [];
  const criticalErrors = [];

  // 从 asar 读取所有目标文件内容，合并用于宿主扫描
  if (fs.existsSync(sourceAsar)) {
    const hostContents = [];
    for (const filePath of filesToTranslate) {
      try {
        const buf = asar.extractFile(sourceAsar, filePath);
        hostContents.push(buf.toString('utf8'));
      } catch (e) { /* skip */ }
    }
    const combinedHost = hostContents.join('\n');
    const hostForUiAudit = combinedHost
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');

    const desktopUIKeys = [
      { key: 'General', label: '常规 (General)' },
      { key: 'Settings', label: '设置 (Settings)' },
      { key: 'Quit', label: '退出 (Quit)' },
      { key: 'Quit Application', label: '退出应用 (Quit Application)' },
      { key: 'Quit Antigravity', label: '退出 Antigravity (Quit Antigravity)' },
      { key: 'Check for Updates', label: '检查更新 (Check for Updates)' },
      { key: 'Check For Updates', label: '检查更新 (Check For Updates)' },
      { key: 'Checking for updates', label: '正在检查更新 (Checking for updates)' },
      { key: 'Update Available', label: '有更新可用 (Update Available)' },
      { key: 'No updates available', label: '无可用更新 (No updates available)' },
      { key: 'Downloading update', label: '正在下载更新 (Downloading update)' },
      { key: 'Restart to Update', label: '重启以更新 (Restart to Update)' },
      { key: 'Restart & Install', label: '重启并安装 (Restart & Install)' },
      { key: 'Restart Application', label: '重启应用 (Restart Application)' },
      { key: 'Update downloaded', label: '更新已下载 (Update downloaded)' },
      { key: 'A new version is available', label: '有新版本可用 (A new version is available)' },
      { key: 'Quit & Install', label: '退出并安装 (Quit & Install)' },
      { key: 'Later', label: '稍后 (Later)' },
      { key: 'Cancel', label: '取消 (Cancel)' },
      { key: 'View', label: '视图 (View)' },
      { key: 'Reload', label: '重新加载 (Reload)' },
      { key: 'Toggle Developer Tools', label: '切换开发者工具 (Toggle Developer Tools)' },
      { key: 'Toggle Full Screen', label: '切换全屏 (Toggle Full Screen)' },
      { key: 'Edit', label: '编辑 (Edit)' },
      { key: 'Undo', label: '撤销 (Undo)' },
      { key: 'Redo', label: '重做 (Redo)' },
      { key: 'Cut', label: '剪切 (Cut)' },
      { key: 'Copy', label: '复制 (Copy)' },
      { key: 'Paste', label: '粘贴 (Paste)' },
      { key: 'Select All', label: '全选 (Select All)' },
      { key: 'Window', label: '窗口 (Window)' },
      { key: 'Minimize', label: '最小化 (Minimize)' },
      { key: 'Close', label: '关闭 (Close)' },
      { key: 'Help', label: '帮助 (Help)' },
      { key: 'About', label: '关于 (About)' },
      { key: 'About Antigravity', label: '关于 Antigravity (About Antigravity)' },
      { key: 'Learn More', label: '了解更多 (Learn More)' },
      { key: 'Documentation', label: '文档 (Documentation)' },
      // —— Appearance（外观）页面 ——
      { key: 'Verbose agent chat', label: '详细智能体对话 (Verbose agent chat)' },
      { key: 'Chat Settings', label: '对话设置 (Chat Settings)' },
      { key: 'Background', label: '背景色 (Background)' },
      { key: 'Foreground', label: '前景色 (Foreground)' },
      { key: 'Accent', label: '强调色 (Accent)' },
      // —— Browser（浏览器）页面 ——
      { key: 'Browser Settings', label: '浏览器设置 (Browser Settings)' },
      { key: 'Enable Browser Tools', label: '启用浏览器工具 (Enable Browser Tools)' },
      { key: 'Chrome Binary Path', label: 'Chrome 可执行文件路径 (Chrome Binary Path)' },
      { key: 'Browser Actuation Permissions', label: '浏览器执行权限 (Browser Actuation Permissions)' },
      // —— Notifications（通知）页面 ——
      { key: 'Notification Settings', label: '通知设置 (Notification Settings)' },
      { key: 'Sound Effects', label: '音效 (Sound Effects)' },
      // —— Tab/Editor（标签页/编辑器）页面 ——
      { key: 'Autocomplete Speed', label: '自动补全速度 (Autocomplete Speed)' },
      { key: 'Navigation', label: '导航 (Navigation)' },
      // —— 通用设置 ——
      { key: 'Model Credits', label: '模型点数 (Model Credits)' },
      { key: 'Enable AI Credit Overages', label: '启用 AI 超额点数 (Enable AI Credit Overages)' },
      { key: 'Review Policy', label: '审核策略 (Review Policy)' },
      { key: 'Terminal Command Auto Execution', label: '终端命令自动执行 (Terminal Command Auto Execution)' },
      { key: 'Open System Preferences', label: '打开系统偏好设置 (Open System Preferences)' }
    ];

    desktopUIKeys.forEach(item => {
      // 仅当该词条作为"带引号的字符串字面量"出现时才视为 UI 文案，
      // 否则它会命中类名(SettingsService)、API(isMinimized)、注释、console.log 等非 UI 场景，造成误报。
      const quotedRe = new RegExp('["\']' + item.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\']');
      const isIncluded = quotedRe.test(hostForUiAudit);
      const isTranslated = translations.some(t => t.old && t.old.includes(item.key));
      if (isIncluded && !isTranslated) {
        warningsCount++;
        hostWarnings.push({
          key: item.key,
          label: item.label,
          message: 'asarch 中存在该核心英文词条，但在当前 translations.json 词库中未作汉化匹配映射！'
        });
      }
    });
  }

  // 核心审计 - 变量一致性
  const isReactCodeStructure = (str) => {
    return /children:\[?p\(|displayResolver:|upgradeButtonText\|\||action:"|rightElement:p\(|function\s+[a-zA-Z0-9_]+\(|^function\s+|=>/.test(str);
  };

  for (let i = 0; i < translations.length; i++) {
    const pair = translations[i];
    const oldVars = extractAllVariables(pair.old);
    const newVars = extractAllVariables(pair.new);

    const missingVars = oldVars.filter(v => !newVars.includes(v));
    const hasChineseBraces = /[\uff5b\uff5d]/.test(pair.new);

    if (missingVars.length > 0) {
      errorsCount++;
      criticalErrors.push({
        index: i,
        oldText: pair.old,
        newText: pair.new,
        message: '汉化译文漏掉了关键插值变量: [' + missingVars.join(', ') + ']，可能会导致运行时崩溃！'
      });
    }

    if (hasChineseBraces) {
      errorsCount++;
      criticalErrors.push({
        index: i,
        oldText: pair.old,
        newText: pair.new,
        message: '汉化译文中包含非法的中文大括号 "｛" 或 "｝"，必须使用英文半角 "{" 和 "}"！'
      });
    }

    // 未翻译检测
    const isCode = isReactCodeStructure(pair.old);
    const hasChinese = /[\u4e00-\u9fa5]/.test(pair.new);
    const isWhiteListedEnglishOnlyTranslation = (oldText, newText) => {
      if (!oldText || !newText) return false;
      if (/lang=["']\w+["']/i.test(oldText) && /lang=["']\w+["']/i.test(newText)) return true;
      if (/<html\b/i.test(oldText) && /<html\b/i.test(newText)) return true;
      if (/charset=/i.test(oldText)) return true;
      if (/zh[-_]cn/i.test(newText)) return true;
      if (/\.(png|jpg|jpeg|gif|svg|ico)/i.test(oldText)) return true;
      return false;
    };

    if (pair.new === pair.old && !isCode) {
      warningsCount++;
      warnings.push({
        index: i,
        oldText: pair.old,
        newText: pair.new,
        message: '词条未完成汉化 (译文与原始英文完全一致)。'
      });
    } else if (!hasChinese && !isCode && pair.new.length > 0) {
      if (/[a-zA-Z]{2,}/.test(pair.new)) {
        if (!isWhiteListedEnglishOnlyTranslation(pair.old, pair.new)) {
          warningsCount++;
          warnings.push({
            index: i,
            oldText: pair.old,
            newText: pair.new,
            message: '疑似未完成翻译：译文中未发现任何汉字，仍残留纯英文字段。'
          });
        }
      }
    }
  }

  // 输出报告
  console.log('\n----------------- i18nt 审计诊断报告 (桌面端) -----------------');
  console.log('[STATUS] 扫描条目总数: ' + translations.length + ' 组');

  if (errorsCount > 0) {
    console.log('\n❌ [ERROR] 发现 ' + errorsCount + ' 处致命语法安全隐患 (已强制拦截后续编译)：');
    criticalErrors.forEach(err => {
      console.log('  ▶ [索引 ' + err.index + ']');
      console.log('    原代码: "' + (err.oldText || '').substring(0, 70) + '..."');
      console.log('    译  文: "' + (err.newText || '').substring(0, 70) + '..."');
      console.log('    错  误: ' + err.message);
    });
  } else {
    console.log('\n✅ [SUCCESS] 变量完整性与插值一致性检测：100% 通过！');
  }

  if (warningsCount > 0) {
    console.log('\n⚠️ [WARN] 发现 ' + warningsCount + ' 处未完成汉化或纯英文残留字段：');
    if (hostWarnings.length > 0) {
      hostWarnings.forEach(hw => {
        console.log('  ▶ [宿主运行库汉化覆盖遗落项]');
        console.log('    核心字段: "' + hw.label + '"');
        console.log('    诊断原因: ' + hw.message);
      });
    }
    if (warnings.length > 0) {
      warnings.forEach(wn => {
        console.log('  ▶ [索引 ' + wn.index + ']');
        console.log('    英  文: "' + (wn.oldText || '').substring(0, 70) + '..."');
        console.log('    现  状: "' + (wn.newText || '').substring(0, 70) + '..."');
        console.log('    诊  断: ' + wn.message);
      });
    }
  } else {
    console.log('\n✅ [SUCCESS] 词库完整度检测：100% 汉化完毕！');
  }

  console.log('--------------------------------------------------------\n');

  // 写回美化后的词库
  try {
    fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
    console.log('[OK] 一键格式化成功！词库文件已重新美化排版并写回。');
  } catch (err) {
    console.error('[ERROR] 写入美化词库文件失败:', err.message);
  }

  return {
    success: errorsCount === 0,
    errorsCount,
    warningsCount
  };
}

function scanIDE(config, translationsPath, targetType) {
  // 保持与原始 IDE 扫描逻辑一致
  console.log('[INFO] 正在启动 Antigravity IDE i18nt 国际化扫描器与格式化引擎...');

  if (!fs.existsSync(translationsPath)) {
    console.error('[ERROR] 找不到词库文件: "' + translationsPath + '"');
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }

  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  } catch (err) {
    console.error('[CRITICAL] 词库 JSON 格式异常，无法解析:', err.message);
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }

  if (!Array.isArray(rawData)) {
    console.error('[ERROR] 词库格式不符合要求，必须为 [{old, new}] 数组形式。');
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }

  const translations = rawData.map(pair => ({
    old: typeof pair.old === 'string' ? pair.old.trim() : pair.old,
    new: typeof pair.new === 'string' ? pair.new.trim() : pair.new
  }));

  console.log('[SAFEGUARD] 正在执行词库文件编码校验...');
  const encodingResult = validateEncoding(translationsPath);
  if (!encodingResult.valid) {
    console.error('[SAFEGUARD] ❌ 词库文件编码校验未通过：' + encodingResult.error);
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }
  console.log('[SAFEGUARD] ✅ 词库文件编码校验通过 (UTF-8)。');

  console.log('[SAFEGUARD] 正在执行词库乱码深度扫描...');
  const garbledResult = detectGarbledText(translations);
  if (!garbledResult.clean) {
    console.error('[SAFEGUARD] ❌ 词库中检测到 ' + garbledResult.errors.length + ' 处乱码文本！');
    garbledResult.errors.forEach(err => {
      console.error('  ▶ [索引 ' + err.index + '] "' + err.text + '..."');
      console.error('    原因: ' + err.reason);
    });
    return { success: false, errorsCount: garbledResult.errors.length, warningsCount: 0 };
  }
  console.log('[SAFEGUARD] ✅ 词库乱码扫描通过。');

  let errorsCount = 0;
  let warningsCount = 0;
  const criticalErrors = [];
  const warnings = [];
  const hostWarnings = [];

  const { targetFilePath, backupSuffix = '.bak' } = config;
  const backupPath = targetFilePath + backupSuffix;
  if (fs.existsSync(backupPath)) {
    const hostContent = fs.readFileSync(backupPath, 'utf8');
    const coreUIKeys = [
      { key: 'Verbose agent chat', label: '详细智能体对话 (Verbose agent chat)' },
      { key: 'Chat Settings', label: '对话设置 (Chat Settings)' },
      { key: 'Model Credits', label: '模型点数 (Model Credits)' },
      { key: 'Notification Settings', label: '通知设置 (Notification Settings)' },
      { key: 'Enable AI Credit Overages', label: '启用超额模型点数 (Enable AI Credit Overages)' },
      { key: 'Open System Preferences', label: '打开系统偏好设置 (Open System Preferences)' },
      { key: 'Terminal Command Auto Execution', label: '终端命令自动执行 (Terminal Command Auto Execution)' },
      { key: 'Review Policy', label: '产物审核策略 (Review Policy)' },
      // —— 新增设置页面审计项 ——
      { key: 'Appearance', label: '外观 (Appearance)' },
      { key: 'Browser Settings', label: '浏览器设置 (Browser Settings)' },
      { key: 'Autocomplete Speed', label: '自动补全速度 (Autocomplete Speed)' },
      { key: 'Sound Effects', label: '音效 (Sound Effects)' },
      { key: 'Background', label: '背景色 (Background)' },
      { key: 'Foreground', label: '前景色 (Foreground)' },
      { key: 'Accent', label: '强调色 (Accent)' }
    ];

    coreUIKeys.forEach(item => {
      const isIncluded = hostContent.includes(item.key);
      const isTranslated = translations.some(t => t.old && t.old.includes(item.key));
      if (isIncluded && !isTranslated) {
        warningsCount++;
        hostWarnings.push({
          key: item.key,
          label: item.label,
          message: '宿主设置页运行库中存在该核心英文词条，但在当前 translations.json 词库中未作汉化匹配映射！'
        });
      }
    });
  }

  const isReactCodeStructure = (str) => {
    return /children:\[?p\(|displayResolver:|upgradeButtonText\|\||action:"|rightElement:p\(|function\s+[a-zA-Z0-9_]+\(|^function\s+|=>/.test(str);
  };

  for (let i = 0; i < translations.length; i++) {
    const pair = translations[i];
    const oldVars = extractAllVariables(pair.old);
    const newVars = extractAllVariables(pair.new);

    const missingVars = oldVars.filter(v => !newVars.includes(v));
    const hasChineseBraces = /[\uff5b\uff5d]/.test(pair.new);

    if (missingVars.length > 0) {
      errorsCount++;
      criticalErrors.push({
        index: i,
        oldText: pair.old,
        newText: pair.new,
        message: '汉化译文漏掉了关键插值变量: [' + missingVars.join(', ') + ']，可能会导致 React 运行时崩溃！'
      });
    }

    if (hasChineseBraces) {
      errorsCount++;
      criticalErrors.push({
        index: i,
        oldText: pair.old,
        newText: pair.new,
        message: '汉化译文中包含非法的中文大括号 "｛" 或 "｝"，必须使用英文半角 "{" 和 "}"！'
      });
    }

    const isCode = isReactCodeStructure(pair.old);
    const hasChinese = /[\u4e00-\u9fa5]/.test(pair.new);
    if (pair.new === pair.old && !isCode) {
      warningsCount++;
      warnings.push({
        index: i,
        oldText: pair.old,
        newText: pair.new,
        message: '词条未完成汉化 (译文与原始英文完全一致)。'
      });
    } else if (!hasChinese && !isCode && pair.new.length > 0) {
      if (/[a-zA-Z]{2,}/.test(pair.new)) {
        warningsCount++;
        warnings.push({
          index: i,
          oldText: pair.old,
          newText: pair.new,
          message: '疑似未完成翻译：译文中未发现任何汉字，仍残留纯英文字段。'
        });
      }
    }
  }

  console.log('\n----------------- i18nt 审计诊断报告 (IDE) -----------------');
  console.log('[STATUS] 扫描条目总数: ' + translations.length + ' 组');

  if (errorsCount > 0) {
    console.log('\n❌ [ERROR] 发现 ' + errorsCount + ' 处致命语法安全隐患 (已强制拦截后续编译)：');
    criticalErrors.forEach(err => {
      console.log('  ▶ [索引 ' + err.index + ']');
      console.log('    原代码: "' + (err.oldText || '').substring(0, 70) + '..."');
      console.log('    译  文: "' + (err.newText || '').substring(0, 70) + '..."');
      console.log('    错  误: ' + err.message);
    });
  } else {
    console.log('\n✅ [SUCCESS] 变量完整性与插值一致性检测：100% 通过！');
  }

  if (warningsCount > 0) {
    console.log('\n⚠️ [WARN] 发现 ' + warningsCount + ' 处未完成汉化或纯英文残留字段：');
    if (hostWarnings.length > 0) {
      hostWarnings.forEach(hw => {
        console.log('  ▶ [宿主运行库汉化覆盖遗落项]');
        console.log('    核心字段: "' + hw.label + '"');
        console.log('    诊断原因: ' + hw.message);
      });
    }
    if (warnings.length > 0) {
      warnings.forEach(wn => {
        console.log('  ▶ [索引 ' + wn.index + ']');
        console.log('    英  文: "' + (wn.oldText || '').substring(0, 70) + '..."');
        console.log('    现  状: "' + (wn.newText || '').substring(0, 70) + '..."');
        console.log('    诊  断: ' + wn.message);
      });
    }
  } else {
    console.log('\n✅ [SUCCESS] 词库完整度检测：100% 汉化完毕！');
  }

  console.log('--------------------------------------------------------\n');

  try {
    fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
    console.log('[OK] 一键格式化成功！词库文件已重新美化排版并写回。');
  } catch (err) {
    console.error('[ERROR] 写入美化词库文件失败:', err.message);
  }

  return {
    success: errorsCount === 0,
    errorsCount,
    warningsCount
  };
}

export function scan(config, translationsPath, targetType = 'antigravity') {
  if (targetType === 'antigravity') {
    return scanDesktop(config, translationsPath);
  } else if (targetType === 'ide') {
    return scanIDE(config, translationsPath, targetType);
  } else {
    console.error('[CRITICAL] 未知目标类型: ' + targetType);
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }
}
