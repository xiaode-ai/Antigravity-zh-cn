import fs from 'fs';
import { extractVariables } from '@xiaode-ai/i18nt';
import { validateEncoding, detectGarbledText } from './safe_guard.js';

/**
 * 对翻译词库进行一键语法审计、变量对齐性检测和高精度格式化
 * @param {Object} config 配置参数 
 * @param {string} translationsPath 词库 translations.json 绝对路径 
 * @returns {Object} 检测报告 { success, errorsCount, warningsCount }
 */
export function scan(config, translationsPath) {
  console.log(`[INFO] 正在启动 i18nt 国际化扫描器与格式化引擎...`);

  if (!fs.existsSync(translationsPath)) {
    console.error(`[ERROR] 找不到词库文件: "${translationsPath}"`);
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }

  // 1. 读取词库并进行基础格式化规整 (Auto-Format)
  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  } catch (err) {
    console.error(`[CRITICAL] 词库 JSON 格式异常，无法解析:`, err.message);
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }

  if (!Array.isArray(rawData)) {
    console.error(`[ERROR] 词库格式不符合要求，必须为[{old, new}]数组形式。`);
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }

  const translations = rawData.map(pair => {
    return {
      old: typeof pair.old === 'string' ? pair.old.trim() : pair.old,
      new: typeof pair.new === 'string' ? pair.new.trim() : pair.new
    };
  });

  // 1.3 🛡️ 编码一致性校验
  console.log(`[SAFEGUARD] 正在执行词库文件编码校验...`);
  const encodingResult = validateEncoding(translationsPath);
  if (!encodingResult.valid) {
    console.error(`\x1b[31m[SAFEGUARD] ❌ 词库文件编码校验未通过：${encodingResult.error}\x1b[0m`);
    return { success: false, errorsCount: 1, warningsCount: 0 };
  }
  console.log(`[SAFEGUARD] ✅ 词库文件编码校验通过 (UTF-8)。`);

  // 1.4 🛡️ 乱码深度检测
  console.log(`[SAFEGUARD] 正在执行词库乱码深度扫描...`);
  const garbledResult = detectGarbledText(translations);
  if (!garbledResult.clean) {
    console.error(`\x1b[31m[SAFEGUARD] ❌ 词库中检测到 ${garbledResult.errors.length} 处乱码文本！\x1b[0m`);
    garbledResult.errors.forEach(err => {
      console.error(`  ▶ [索引 ${err.index}] "${err.text}..."`);
      console.error(`    原因: ${err.reason}`);
    });
    return { success: false, errorsCount: garbledResult.errors.length, warningsCount: 0 };
  }
  console.log(`[SAFEGUARD] ✅ 词库乱码扫描通过，未发现编码异常。`);

  // 1.5 宿主大文件残余英文深度覆盖审计 (Host Coverage Auditor)
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
      { key: "Verbose agent chat", label: "详细智能体对话 (Verbose agent chat)" },
      { key: "Chat Settings", label: "对话设置 (Chat Settings)" },
      { key: "Model Credits", label: "模型点数 (Model Credits)" },
      { key: "Notification Settings", label: "通知设置 (Notification Settings)" },
      { key: "Enable AI Credit Overages", label: "启用超额模型点数 (Enable AI Credit Overages)" },
      { key: "Open System Preferences", label: "打开系统偏好设置 (Open System Preferences)" },
      { key: "Terminal Command Auto Execution", label: "终端命令自动执行 (Terminal Command Auto Execution)" },
      { key: "Review Policy", label: "产物审核策略 (Review Policy)" }
    ];

    coreUIKeys.forEach(item => {
      const isIncluded = hostContent.includes(item.key);
      const isTranslated = translations.some(t => t.old && t.old.includes(item.key));
      if (isIncluded && !isTranslated) {
        warningsCount++;
        hostWarnings.push({
          key: item.key,
          label: item.label,
          message: `宿主设置页运行库中存在该核心英文词条，但在当前 translations.json 词库中未作汉化匹配映射！`
        });
      }
    });
  }

  // 2. 核心审计与静态分析

  // 判断是否是代码渲染拦截逻辑段，比如带有 "children:p(" 或 "displayResolver:" 等特征的代码片段
  const isReactCodeStructure = (str) => {
    return /children:\[?p\(|displayResolver:|upgradeButtonText\|\||action:"|rightElement:p\(|function\s+[a-zA-Z0-9_]+\(|^function\s+|=>/.test(str);
  };

  for (let i = 0; i < translations.length; i++) {
    const pair = translations[i];
    const index = i;

    // A. 严重错误检测：React 插值变量与 ICU 大括号对比 (一致性校验)
    const oldVars = extractAllVariables(pair.old);
    const newVars = extractAllVariables(pair.new);

    // 检查 old 中有的变量，new 中是否也必须有，或者有没有写错了中文花括号
    const missingVars = oldVars.filter(v => !newVars.includes(v));
    
    // 检查 new 中是否有非法/写错的中文大括号
    const hasChineseBraces = /[\uff5b\uff5d]/.test(pair.new);

    if (missingVars.length > 0) {
      errorsCount++;
      criticalErrors.push({
        index,
        oldText: pair.old,
        newText: pair.new,
        message: `汉化译文漏掉了关键插值变量: [${missingVars.join(', ')}]，可能会导致 React 运行时崩溃！`
      });
    }

    if (hasChineseBraces) {
      errorsCount++;
      criticalErrors.push({
        index,
        oldText: pair.old,
        newText: pair.new,
        message: `汉化译文中包含非法的中文大括号 “｛” 或 “｝”，必须使用英文半角 “{” 和 “}”！`
      });
    }

    // B. 警告级别检测：未翻译或纯英文残留审计
    const isCode = isReactCodeStructure(pair.old);
    const hasChinese = /[\u4e00-\u9fa5]/.test(pair.new);

    if (pair.new === pair.old && !isCode) {
      warningsCount++;
      warnings.push({
        index,
        oldText: pair.old,
        newText: pair.new,
        message: `词条未完成汉化 (译文与原始英文完全一致)。`
      });
    } else if (!hasChinese && !isCode && pair.new.length > 0) {
      // 排除掉单纯的符号、数值等
      if (/[a-zA-Z]{2,}/.test(pair.new)) {
        warningsCount++;
        warnings.push({
          index,
          oldText: pair.old,
          newText: pair.new,
          message: `疑似未完成翻译：译文中未发现任何汉字，仍残留纯英文字段。`
        });
      }
    }
  }

  // 3. 输出美观的控制台检测报告
  console.log(`\n----------------- i18nt 审计诊断报告 -----------------`);
  console.log(`[STATUS] 扫描条目总数: ${translations.length} 组`);
  
  if (errorsCount > 0) {
    console.log(`\n❌ [ERROR] 发现 ${errorsCount} 处致命语法安全隐患 (已强制拦截后续编译)：`);
    criticalErrors.forEach(err => {
      console.log(`  ▶ [索引 ${err.index}]`);
      console.log(`    原代码: "${err.oldText.substring(0, 70)}..."`);
      console.log(`    译  文: "${err.newText.substring(0, 70)}..."`);
      console.log(`    错  误: \x1b[31m${err.message}\x1b[0m`);
    });
  } else {
    console.log(`\n✅ [SUCCESS] 变量完整性与插值一致性检测：100% 通过！`);
  }

  if (warningsCount > 0) {
    console.log(`\n⚠️ [WARN] 发现 ${warningsCount} 处未完成汉化或纯英文残留字段：`);
    
    // A. 打印宿主大文件汉化覆盖漏洞预警
    if (hostWarnings.length > 0) {
      hostWarnings.forEach(hw => {
        console.log(`  ▶ \x1b[33m[宿主运行库汉化覆盖遗落项]\x1b[0m`);
        console.log(`    核心字段: "${hw.label}"`);
        console.log(`    诊断原因: ${hw.message}`);
      });
    }

    // B. 打印已配置字典中的翻译状态警告
    if (warnings.length > 0) {
      warnings.forEach(warn => {
        console.log(`  ▶ [索引 ${warn.index}]`);
        console.log(`    英  文: "${warn.oldText.substring(0, 70)}..."`);
        console.log(`    现  状: "${warn.newText.substring(0, 70)}..."`);
        console.log(`    诊  断: \x1b[33m${warn.message}\x1b[0m`);
      });
    }
  } else {
    console.log(`\n✅ [SUCCESS] 词库完整度检测：100% 汉化完毕！`);
  }

  console.log(`--------------------------------------------------------\n`);

  // 4. 写回美化并自动排版后的词库 translations.json
  try {
    fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
    console.log(`[OK] 一键格式化成功！词库文件已重新美化排版并写回。`);
  } catch (err) {
    console.error(`[ERROR] 写入美化词库文件失败:`, err.message);
  }

  return {
    success: errorsCount === 0,
    errorsCount,
    warningsCount
  };
}

/**
 * 混合变量提取器：原生 ICU extractVariables 与正则表达式组合，达到极致鲁棒性
 * @param {string} str 待提取的字符串
 * @returns {Array} 变量名集合
 */
function extractAllVariables(str) {
  if (!str) return [];
  const variables = new Set();

  // A. 正则提取 JS 模板插值 `${variable}` 或者 `${r.product.nameShort}`
  const templateRegex = /\$\{\s*([a-zA-Z0-9_\.]+)\s*\}/g;
  let match;
  while ((match = templateRegex.exec(str)) !== null) {
    variables.add(match[0]); // 把完整的 ${var} 记录为插值单元，要求精确一致
  }

  // B. 尝试利用 i18nt 原生 extractVariables 提取标准的 ICU 大括号变量 (如 {count}, {v, number})
  try {
    const icuVars = extractVariables(str);
    if (Array.isArray(icuVars)) {
      icuVars.forEach(v => variables.add(`{${v}}`));
    }
  } catch (e) {
    // 无法以标准 ICU 格式解析的代码段，退回到正则大括号匹配
    const braceRegex = /\{([a-zA-Z0-9_\.]+)\}/g;
    let bMatch;
    while ((bMatch = braceRegex.exec(str)) !== null) {
      variables.add(bMatch[0]);
    }
  }

  return Array.from(variables);
}
