import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 载入核心逻辑子模块
import { translate } from './translate.js';
import { rollback } from './rollback.js';
import { check } from './check.js';
import { scan } from './scan.js';
import { autoRollbackOnFailure } from './safe_guard.js';

// 初始化绝对目录解析 (ESM 下的 __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, '..');

// 1. 读取配置文件与翻译词库路径
const configPath = path.join(rootPath, 'config.json');
const translationsPath = path.join(rootPath, 'translations.json');

if (!fs.existsSync(configPath) || !fs.existsSync(translationsPath)) {
  console.error('[CRITICAL ERROR] 缺少 config.json 或 translations.json 核心文件，初始化项目失败！');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 2. 调度命令行参数
const action = process.argv[2];

console.log(`\n================ Antigravity L10N 工具 ================`);

switch (action) {
  case 'translate':
    try {
      console.log(`[ACTION] 正在执行前置安全扫描诊断...`);
      const scanReport = scan(config, translationsPath);
      
      // 最佳实践：前置强拦截。一旦发现致命的大括号插值或语法错误，必须立刻终止，保护 IDE 运行库不受破坏。
      if (!scanReport.success) {
        console.error(`\x1b[31m[CRITICAL] 前置扫描发现致命语法错误！已被强行拦截。请在 translations.json 中修正后重试。\x1b[0m`);
        console.log(`========================================================\n`);
        process.exit(1);
      }

      console.log(`[ACTION] 安全扫描通过，正在执行一键中文化替换...`);
      // 重新从最新的 translationsPath 读取已格式化规整后的词库
      const updatedTranslations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
      const success = translate(config, updatedTranslations, translationsPath);
      if (success) {
        console.log(`\n[ACTION] 正在自动执行编译后文件校验...`);
        check(config);
      }
    } catch (err) {
      console.error(`\x1b[31m[CRITICAL] 翻译流程发生未预期异常: ${err.message}\x1b[0m`);
      autoRollbackOnFailure(config, `未预期异常: ${err.message}`);
      process.exit(1);
    }
    break;

  case 'rollback':
    console.log(`[ACTION] 正在执行还原英文原版...`);
    const rolled = rollback(config);
    if (rolled) {
      console.log(`\n[ACTION] 正在自动执行还原文件校验...`);
      check(config);
    }
    break;

  case 'check':
    console.log(`[ACTION] 正在对 IDE 代码库进行安全性检测...`);
    check(config);
    break;

  case 'scan':
    console.log(`[ACTION] 正在执行一键检测与字典格式化...`);
    scan(config, translationsPath);
    break;

  default:
    console.log('使用说明:');
    console.log('  npm run translate  - 安全检测、自动备份并一键汉化特定页面');
    console.log('  npm run rollback   - 一键完美还原至原始英文官方版本');
    console.log('  npm run check      - 对当前主运行库文件执行语法和破损诊断');
    console.log('  npm run scan       - 一键静态审计检测翻译词库并自动美化格式化');
    console.log('\n参数说明:');
    console.log('  node src/index.js <translate | rollback | check | scan>');
    break;
}

console.log(`========================================================\n`);
