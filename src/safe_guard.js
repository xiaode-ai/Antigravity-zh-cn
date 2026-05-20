import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { rollback } from './rollback.js';

/**
 * 🛡️ 安全守卫模块：多层防护机制，防止汉化后 IDE 崩溃无法启动
 * 
 * 核心防护层：
 *   1. 编码一致性校验 — 拒绝非 UTF-8 编码的词库文件
 *   2. 乱码检测器 — 扫描翻译文本中的 GBK→UTF-8 二次转码乱码
 *   3. 翻译后启动预检 — 校验生成文件的完整性与安全性
 *   4. 自动回滚保护 — 任何失败自动恢复出厂状态
 */

// ============================================================================
// 1. 编码一致性校验
// ============================================================================

/**
 * 验证文件是否为合法 UTF-8 编码
 * 拒绝 UTF-16 LE/BE BOM、GBK 等非 UTF-8 编码
 * @param {string} filePath 文件绝对路径
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEncoding(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);

    // 检测 UTF-16 LE BOM (FF FE)
    if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
      return { valid: false, error: '文件编码为 UTF-16 LE（检测到 BOM: FF FE），必须转换为 UTF-8。' };
    }

    // 检测 UTF-16 BE BOM (FE FF)
    if (buffer.length >= 2 && buffer[0] === 0xFE && buffer[1] === 0xFF) {
      return { valid: false, error: '文件编码为 UTF-16 BE（检测到 BOM: FE FF），必须转换为 UTF-8。' };
    }

    // 验证是否为合法的 UTF-8 序列
    // Node.js 的 TextDecoder 在 fatal 模式下遇到非法 UTF-8 会抛出异常
    const decoder = new TextDecoder('utf-8', { fatal: true });
    // 跳过可能存在的 UTF-8 BOM (EF BB BF)
    const startOffset = (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) ? 3 : 0;
    decoder.decode(buffer.subarray(startOffset));

    return { valid: true };
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.includes('decode')) {
      return { valid: false, error: `文件包含非法 UTF-8 字节序列，可能是 GBK 或其他编码：${err.message}` };
    }
    return { valid: false, error: `编码校验时发生意外错误：${err.message}` };
  }
}

// ============================================================================
// 2. 乱码检测器
// ============================================================================

/**
 * GBK→UTF-8 二次转码时产生的实际乱码多字序列
 * 
 * 原理：当 PowerShell 以 GBK (Code Page 936) 向 UTF-8 文件追加中文时，
 * 每个 UTF-8 中文字符（3字节）会被当作3个 GBK 字符重新编码，
 * 产出一系列特定的高频乱码汉字组合。
 * 
 * 以下是从 RESCUE.md 中实际故障样本提取的确切乱码序列，
 * 使用完整的多字符序列匹配而非单字符类，以避免误报。
 */

/**
 * 严格的乱码检测规则：
 * 只匹配「Unicode 替换字符」或「已知的 GBK 转码乱码序列」
 * 这些多字序列是实际发生过的乱码（如 RESCUE.md 中记录的 "浙嘷誇解鏇更村"）
 */
const CRITICAL_GARBLED_PATTERNS = [
  // Unicode 替换字符 — 通常由解码失败产生
  /\uFFFD/,
  // 已知的 GBK→UTF-8 双重编码乱码序列（来自实际故障样本）
  /浙嘷誇解鏇更村/,
  /浙嘷誇解/,
  /鏇更村/,
  // 常见的 GBK 双重编码模式：连续4个以上生僻字组合（CJK统一表意文字扩展B区域）
  /[\u3400-\u4DBF]{4,}/u,
];

/**
 * 扫描翻译词库中是否存在乱码文本
 * @param {Array<{old: string, new: string}>} translations 翻译词典
 * @returns {{ clean: boolean, errors: Array<{index: number, text: string, reason: string}> }}
 */
export function detectGarbledText(translations) {
  const errors = [];

  for (let i = 0; i < translations.length; i++) {
    const pair = translations[i];
    const newText = pair.new || '';

    // 跳过纯英文/代码段（不含中文的条目不需要乱码检测）
    if (!/[\u4e00-\u9fff]/.test(newText) && !/\uFFFD/.test(newText)) {
      continue;
    }

    // 检查 Unicode 替换字符
    if (/\uFFFD/.test(newText)) {
      errors.push({
        index: i,
        text: newText.substring(0, 60),
        reason: '译文包含 Unicode 替换字符 (U+FFFD)，通常由编码转换失败导致。'
      });
      continue;
    }

    // 检查高确信度乱码模式
    for (const pattern of CRITICAL_GARBLED_PATTERNS) {
      if (pattern.test(newText)) {
        errors.push({
          index: i,
          text: newText.substring(0, 60),
          reason: '译文中检测到高确信度 GBK→UTF-8 二次转码乱码字符特征。'
        });
        break;
      }
    }
  }

  return {
    clean: errors.length === 0,
    errors
  };
}

/**
 * 在翻译写入后对生成文件进行安全性预检
 * @param {string} generatedFilePath 翻译后生成的文件路径
 * @param {string} backupFilePath 原始备份文件路径
 * @returns {{ safe: boolean, errors: string[] }}
 */
export function launchPreCheck(generatedFilePath, backupFilePath) {
  const errors = [];

  // A. 检查文件是否存在
  if (!fs.existsSync(generatedFilePath)) {
    errors.push(`生成的文件不存在: "${generatedFilePath}"`);
    return { safe: false, errors };
  }

  // B. 文件大小合理性校验（与备份文件对比，差异不应超过 ±10%）
  // 中文字符比英文占更多字节，汉化后文件通常会略大，但不会大太多
  if (fs.existsSync(backupFilePath)) {
    const genSize = fs.statSync(generatedFilePath).size;
    const bakSize = fs.statSync(backupFilePath).size;
    const ratio = genSize / bakSize;

    if (ratio < 0.90) {
      errors.push(`生成文件大小异常偏小：${genSize} 字节（备份为 ${bakSize} 字节，比率 ${(ratio * 100).toFixed(1)}%）。可能文件内容被截断或损坏。`);
    } else if (ratio > 1.15) {
      errors.push(`生成文件大小异常偏大：${genSize} 字节（备份为 ${bakSize} 字节，比率 ${(ratio * 100).toFixed(1)}%）。可能存在重复替换或数据膨胀。`);
    }
  }

  // C. 检查文件内容是否含有 Unicode 替换字符
  const content = fs.readFileSync(generatedFilePath, 'utf8');
  if (/\uFFFD/.test(content)) {
    errors.push('生成的文件中包含 Unicode 替换字符 (U+FFFD)，表明存在编码损坏。');
  }

  // D. Node.js 语法校验——使用 .js 后缀的临时副本来避免扩展名问题
  const checkCopyPath = generatedFilePath.replace(/\.[^.]+$/, '.check.js');
  try {
    // 如果原文件就是 .js，直接校验；否则复制一份 .js 副本
    if (generatedFilePath.endsWith('.js')) {
      execSync(`node --check "${generatedFilePath}"`, { stdio: 'pipe' });
    } else {
      fs.copyFileSync(generatedFilePath, checkCopyPath);
      try {
        execSync(`node --check "${checkCopyPath}"`, { stdio: 'pipe' });
      } finally {
        try { fs.unlinkSync(checkCopyPath); } catch {}
      }
    }
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString().substring(0, 500) : err.message;
    errors.push(`Node.js 语法校验未通过：${stderr}`);
  }

  return {
    safe: errors.length === 0,
    errors
  };
}

// ============================================================================
// 4. 自动回滚保护
// ============================================================================

/**
 * 当翻译流程失败时自动执行回滚，确保 IDE 始终可启动
 * @param {Object} config 配置参数
 * @param {string} reason 回滚原因
 * @returns {boolean} 回滚是否成功
 */
export function autoRollbackOnFailure(config, reason) {
  console.error(`\n\x1b[31m[SAFEGUARD] ⚠️ 检测到翻译流程异常，正在自动执行安全回滚...`);
  console.error(`[SAFEGUARD] 回滚原因: ${reason}\x1b[0m\n`);

  try {
    const success = rollback(config);
    if (success) {
      console.log(`\x1b[32m[SAFEGUARD] ✅ 自动回滚成功！IDE 运行库已安全恢复至出厂英文状态。\x1b[0m`);
      console.log(`[SAFEGUARD] 请检查 translations.json 词库文件是否存在编码或内容问题后重试。`);
    } else {
      console.error(`\x1b[31m[SAFEGUARD] ❌ 自动回滚失败！请手动执行 npm run rollback 恢复。\x1b[0m`);
    }
    return success;
  } catch (err) {
    console.error(`\x1b[31m[SAFEGUARD] ❌ 自动回滚过程中发生错误: ${err.message}\x1b[0m`);
    console.error(`[SAFEGUARD] 请立即手动执行以下命令恢复：`);
    console.error(`  node src/index.js rollback`);
    return false;
  }
}

// ============================================================================
// 5. 临时文件安全替换
// ============================================================================

/**
 * 将内容先写入临时文件，校验通过后再替换正式文件
 * @param {string} targetPath 正式目标文件路径
 * @param {string} content 待写入内容
 * @param {string} backupPath 备份文件路径（用于大小对比）
 * @returns {{ success: boolean, error?: string }}
 */
export function safeWriteWithValidation(targetPath, content, backupPath) {
  const tmpPath = targetPath + '.tmp';

  try {
    // 第一步：写入临时文件
    fs.writeFileSync(tmpPath, content, 'utf8');

    // 第二步：对临时文件执行预检
    const preCheck = launchPreCheck(tmpPath, backupPath);
    if (!preCheck.safe) {
      // 清理临时文件
      try { fs.unlinkSync(tmpPath); } catch {}
      return {
        success: false,
        error: `译后安全预检未通过：\n  - ${preCheck.errors.join('\n  - ')}`
      };
    }

    // 第三步：校验通过，将临时文件替换正式文件
    fs.renameSync(tmpPath, targetPath);

    return { success: true };
  } catch (err) {
    // 清理临时文件
    try { fs.unlinkSync(tmpPath); } catch {}
    return {
      success: false,
      error: `安全写入过程异常: ${err.message}`
    };
  }
}
