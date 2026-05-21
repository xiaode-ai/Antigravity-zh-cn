import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { backup } from './backup.js';
import {
  validateEncoding,
  detectGarbledText,
  safeWriteWithValidation,
  autoRollbackOnFailure
} from './safe_guard.js';

/**
 * 核心汉化引擎：读取备份，安全匹配替换，写入主文件并更新完整性哈希
 * 
 * 🛡️ 安全加固版：集成多层防护机制
 *   - 翻译前：编码校验 + 乱码检测
 *   - 写入时：先写临时文件，校验通过后再替换正式文件
 *   - 失败时：自动回滚恢复出厂状态
 * 
 * @param {Object} config 配置参数 
 * @param {Array} translations 汉化词典列表 
 * @param {string} translationsPath 词库文件路径（用于编码预检）
 * @returns {boolean} 是否翻译成功
 */
export function translate(config, translations, translationsPath) {
  const { targetFilePath, backupSuffix = '.bak' } = config;
  const backupPath = targetFilePath + backupSuffix;

  console.log(`[INFO] 正在启动汉化编译器...`);

  // ===== 🛡️ 安全预检阶段 =====

  // 0a. 编码一致性校验：确保词库文件为合法 UTF-8
  if (translationsPath) {
    console.log(`[SAFEGUARD] 正在执行词库文件编码校验...`);
    const encodingResult = validateEncoding(translationsPath);
    if (!encodingResult.valid) {
      console.error(`\x1b[31m[SAFEGUARD] ❌ 词库文件编码校验未通过：${encodingResult.error}\x1b[0m`);
      return false;
    }
    console.log(`[SAFEGUARD] ✅ 词库文件编码校验通过 (UTF-8)。`);
  }

  // 0b. 乱码检测：扫描翻译文本中是否存在 GBK→UTF-8 二次转码乱码
  console.log(`[SAFEGUARD] 正在执行词库乱码深度扫描...`);
  const garbledResult = detectGarbledText(translations);
  if (!garbledResult.clean) {
    console.error(`\x1b[31m[SAFEGUARD] ❌ 词库中检测到 ${garbledResult.errors.length} 处乱码文本！\x1b[0m`);
    garbledResult.errors.forEach(err => {
      console.error(`  ▶ [索引 ${err.index}] "${err.text}..."`);
      console.error(`    原因: ${err.reason}`);
    });
    console.error(`\x1b[31m[SAFEGUARD] 已强行拦截编译。请修正 translations.json 中的乱码后重试。\x1b[0m`);
    return false;
  }
  console.log(`[SAFEGUARD] ✅ 词库乱码扫描通过，未发现编码异常。`);

  // ===== 核心翻译阶段 =====

  // 1. 自动执行一次安全备份，确保有原始出厂备份存底
  const backupSuccess = backup(config);
  if (!backupSuccess) {
    console.error(`[ERROR] 备份失败，终止翻译以保护系统安全。`);
    return false;
  }

  // 2. 核心最佳实践：始终读取最干净的备份文件作为输入源，
  // 这样即便多次重复运行翻译，或者词库中途被微调，也不会造成脏替换冲突！
  console.log(`[INFO] 正在载入原始代码备份...`);
  let content;
  try {
    content = fs.readFileSync(backupPath, 'utf8');
  } catch (err) {
    console.error(`[ERROR] 读取备份文件失败:`, err.message);
    return false;
  }

  const originalContent = content; // 保留最原始备份内容，用于识别映射是否在源码中根本不存在

  // 3. 执行翻译对照替换
  // 最佳实践：按照原始代码段 (old) 的长度进行由长到短的降序排序。
  // 这能强力确保包含子短语的长句（如长反馈文本段落）在子短语（如 "Allow", "Deny", "Actual behavior"）被翻译前，
  // 得到优先完整匹配并汉化。从而完美避开因短条目提前全局替换把长句"撕碎"导致的汉化失效，最大化匹配成功率！
  const sortedTranslations = [...translations].sort((a, b) => b.old.length - a.old.length);

  console.log(`[INFO] 开始应用汉化词典 (共载入 ${sortedTranslations.length} 组匹配，已智能完成长度降序重排)...`);
  let replacedCount = 0;
  const unappliedAbsolute = []; // 源码中完全不存在的失效映射
  
  for (let i = 0; i < sortedTranslations.length; i++) {
    const pair = sortedTranslations[i];
    if (content.includes(pair.old)) {
      content = content.replaceAll(pair.old, pair.new);
      replacedCount++;
    } else {
      // 检查该词条是否在原始源码中就完全不存在
      if (!originalContent.includes(pair.old)) {
        unappliedAbsolute.push(pair);
      } else {
        // 如果原始代码里有，但当前 content 中已经找不到了，
        // 说明它作为子词条已经被前序更长的词条合并替换（即已汉化）。计入成功数。
        replacedCount++;
      }
    }
  }

  console.log(`[INFO] 替换完毕，成功应用 ${replacedCount} / ${sortedTranslations.length} 组映射。`);

  if (unappliedAbsolute.length > 0) {
    console.log(`\n\x1b[33m[WARN] 发现 ${unappliedAbsolute.length} 组失效的映射 (源码中未找到对应的英文词条，可能已过期)：\x1b[0m`);
    unappliedAbsolute.forEach((pair, index) => {
      const snippet = pair.old.substring(0, 50).replace(/\n/g, ' ');
      console.log(`  ▶ [失效 ${index + 1}] "${snippet}${pair.old.length > 50 ? '...' : ''}"`);
    });
    console.log(`\x1b[33m[TIP] 建议根据需要，从 translations.json 中清理这些已失效的词条。\x1b[0m\n`);
  }


  // ===== 🛡️ 安全写入阶段：先写临时文件，校验通过后再替换 =====
  console.log(`[SAFEGUARD] 正在执行安全写入（暂存 → 校验 → 替换）...`);
  const writeResult = safeWriteWithValidation(targetFilePath, content, backupPath);

  if (!writeResult.success) {
    console.error(`\x1b[31m[SAFEGUARD] ❌ 安全写入失败：${writeResult.error}\x1b[0m`);
    // 自动回滚
    autoRollbackOnFailure(config, writeResult.error);
    return false;
  }

  console.log(`[SAFEGUARD] ✅ 安全写入成功！译后文件已通过全部预检。`);
  console.log(`[OK] 汉化代码已成功写入运行库。`);

  // 5. 自动更新 product.json 中的完整性哈希校验，防止报"安装已损坏"错误
  try {
    console.log(`[INFO] 正在为汉化后的文件重新计算并更新完整性校验哈希...`);
    const productPath = path.join(path.dirname(targetFilePath), '..', '..', 'product.json');
    if (fs.existsSync(productPath)) {
      const fileBuffer = fs.readFileSync(targetFilePath);
      const newHash = crypto.createHash('sha256').update(fileBuffer).digest('base64').replace(/=+$/, '');
      
      const productContent = fs.readFileSync(productPath, 'utf8');
      const productData = JSON.parse(productContent.replace(/\uFEFF/g, ''));
      if (productData.checksums) {
        const oldHash = productData.checksums['jetskiAgent/main.js'];
        productData.checksums['jetskiAgent/main.js'] = newHash;
        fs.writeFileSync(productPath, JSON.stringify(productData, null, 2), 'utf8');
        console.log(`[OK] 完整性校验哈希已成功更新：\n     原哈希: ${oldHash}\n     新哈希: ${newHash}`);
      } else {
        console.warn(`[WARN] 找不到 product.json 中的 checksums 属性，跳过哈希更新。`);
      }
    } else {
      console.warn(`[WARN] 找不到 product.json 文件，路径: "${productPath}"，跳过哈希更新。`);
    }

    console.log(`[OK] 汉化完成！`);
    return true;
  } catch (err) {
    console.error(`[ERROR] 更新校验哈希时发生错误:`, err.message);
    // 哈希更新失败不触发回滚（文件内容本身是正确的），但报告错误
    console.warn(`[WARN] 哈希更新失败但翻译文件本身完整，IDE 可能显示"安装已损坏"提示但功能不受影响。`);
    return true;
  }
}
