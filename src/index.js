#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { translate } from './translate.js';
import { rollback } from './rollback.js';
import { check } from './check.js';
import { scan } from './scan.js';
import { autoRollbackOnFailure } from './safe_guard.js';
import { prune } from './prune.js';
import { collectDom } from './collect_dom.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, '..');

const cwdConfigPath = path.join(process.cwd(), 'config.json');
const rootConfigPath = path.join(rootPath, 'config.json');
const exampleConfigPath = path.join(rootPath, 'config.json.example');

let configPath = '';

if (fs.existsSync(cwdConfigPath)) {
  configPath = cwdConfigPath;
} else if (fs.existsSync(rootConfigPath)) {
  configPath = rootConfigPath;
} else {
  console.log(`[INFO] 未检测到 config.json 配置文件。`);
  if (fs.existsSync(exampleConfigPath)) {
    try {
      fs.copyFileSync(exampleConfigPath, cwdConfigPath);
      console.log(`\x1b[32m[SUCCESS] 已基于模板自动在当前目录创建了 config.json 文件。\x1b[0m`);
    } catch (e) {
      console.error(`[ERROR] 自动创建 config.json 失败: ${e.message}`);
    }
  } else {
    console.error('[CRITICAL ERROR] 缺少 config.json.example 模板文件，初始化项目失败！');
  }
  process.exit(1);
}

const cwdTranslationsPath = path.join(process.cwd(), 'translations.json');
const rootTranslationsPath = path.join(rootPath, 'translations.json');
let translationsPath = '';

if (fs.existsSync(cwdTranslationsPath)) {
  translationsPath = cwdTranslationsPath;
} else if (fs.existsSync(rootTranslationsPath)) {
  translationsPath = rootTranslationsPath;
} else {
  console.error('[CRITICAL ERROR] 缺少 translations.json 核心翻译文件，初始化项目失败！');
  process.exit(1);
}

const fullConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const action = process.argv[2];
const targetType = process.argv[3] || 'antigravity';

console.log(`\n================ Antigravity zh-cn 工具 ================`);
console.log(`[TARGET] 目标类型: ${targetType}`);

const validTargets = ['antigravity', 'ide'];
if (!validTargets.includes(targetType)) {
  console.error(`\x1b[31m[CRITICAL] 无效的目标类型 "${targetType}"。支持的类型: ${validTargets.join(', ')}\x1b[0m`);
  console.log(`========================================================\n`);
  process.exit(1);
}

const config = fullConfig[targetType] || fullConfig;

(async () => {
  switch (action) {
    case 'translate':
      try {
        console.log(`[ACTION] 正在执行前置安全扫描诊断...`);
        const scanReport = scan(config, translationsPath, targetType);

        if (!scanReport.success) {
          console.error(`\x1b[31m[CRITICAL] 前置扫描发现致命语法错误！已被强行拦截。请在 translations.json 中修正后重试。\x1b[0m`);
          console.log(`========================================================\n`);
          process.exit(1);
        }

        console.log(`[ACTION] 安全扫描通过，正在执行一键中文化替换...`);
        const updatedTranslations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
        const success = await translate(config, updatedTranslations, translationsPath, targetType);
        if (success) {
          console.log(`\n[ACTION] 正在自动执行编译后文件校验...`);
          await check(config, targetType);
        }
      } catch (err) {
        console.error(`\x1b[31m[CRITICAL] 翻译流程发生未预期异常: ${err.message}\x1b[0m`);
        autoRollbackOnFailure(config, `未预期异常: ${err.message}`);
        process.exit(1);
      }
      break;

    case 'rollback':
      console.log(`[ACTION] 正在执行还原英文原版...`);
      const rolled = rollback(config, targetType);
      if (rolled) {
        console.log(`\n[ACTION] 正在自动执行还原文件校验...`);
        await check(config, targetType);
      }
      break;

    case 'check':
      console.log(`[ACTION] 正在对应用进行安全性检测...`);
      await check(config, targetType);
      break;

    case 'scan':
      console.log(`[ACTION] 正在执行一键检测与字典格式化...`);
      scan(config, translationsPath, targetType);
      break;

    case 'prune':
      console.log(`[ACTION] 正在执行无用翻译条目清理 (剪裁)...`);
      prune(config, translationsPath, targetType);
      break;

    case 'collect-dom':
    case 'scan-dom':
      console.log(`[ACTION] 正在扫描页面未翻译 DOM 文本（含隐藏设置页）...`);
      await collectDom();
      break;

    default:
      console.log('使用说明:');
      console.log('  npm run translate             - 一键中文化 Antigravity 桌面端');
      console.log('  npm run translate ide         - 一键中文化 Antigravity IDE');
      console.log('  npm run rollback              - 还原 Antigravity 桌面端至英文原版');
      console.log('  npm run rollback ide          - 还原 Antigravity IDE 至英文原版');
      console.log('  npm run check                 - 检测桌面端语法和完整性');
      console.log('  npm run check ide             - 检测 IDE 语法和完整性');
      console.log('  npm run scan                  - 格式化桌面端翻译词库');
      console.log('  npm run scan ide              - 格式化 IDE 翻译词库');
      console.log('  npm run prune                 - 清理桌面端过期翻译条目');
      console.log('  npm run prune ide             - 清理 IDE 过期翻译条目');
      console.log('  npm run collect-dom           - 扫描所有页面（含隐藏设置页）未翻译 DOM 文本');
      console.log('  npm run collect-dom -- --visible-only - 仅扫描当前可见页面未翻译 DOM 文本');
      console.log('\n参数说明:');
      console.log('  node src/index.js <translate|rollback|check|scan|prune|collect-dom> [antigravity|ide]');
      console.log('  目标类型默认: antigravity (桌面端)');
      break;
  }

  console.log(`========================================================\n`);
})().catch(err => {
  console.error(`\x1b[31m[CRITICAL] 未处理的异常: ${err.message}\x1b[0m`);
  process.exit(1);
});
