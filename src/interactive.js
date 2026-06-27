import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.join(__dirname, '..');

console.log(`========================================================`);
console.log(`             Antigravity 汉化与还原工具`);
console.log(`========================================================\n`);

// 1. 检测依赖并安装
const nodeModulesPath = path.join(rootPath, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log(`[INFO] 未检测到依赖库，正在自动安装依赖 [npm install]...`);
  try {
    execSync('npm install', { cwd: rootPath, stdio: 'inherit' });
    console.log(`\x1b[32m[SUCCESS] 依赖安装成功！\x1b[0m\n`);
  } catch (err) {
    console.error(`\x1b[31m[ERROR] 依赖安装失败，请检查网络并手动运行 "npm install"。\x1b[0m`);
    process.exit(1);
  }
}

// 2. 菜单选择
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`请选择您需要执行的操作:`);
console.log(`--------------------------------------------------------`);
console.log(`[1] 汉化 Antigravity`);
console.log(`[2] 还原 Antigravity`);
console.log(`[3] 汉化 Antigravity IDE`);
console.log(`[4] 还原 Antigravity IDE`);
console.log(`[5] 退出`);
console.log(`--------------------------------------------------------\n`);

function executeAction(action, target) {
  rl.close();
  const actionLabel = action === 'translate' ? '汉化' : '还原';
  const targetLabel = target === 'antigravity' ? '桌面端' : 'IDE';

  console.log(`\n[INFO] 正在执行一键${actionLabel} (${targetLabel})...`);

  const cmd = `node src/index.js ${action} ${target}`;
  try {
    execSync(cmd, { cwd: rootPath, stdio: 'inherit' });
    console.log(`\n\x1b[32m[SUCCESS] Antigravity ${targetLabel}${actionLabel}完成！\x1b[0m`);
    if (action === 'translate') {
      console.log(`[提示] 请重新启动您的 Antigravity ${targetLabel} 以使汉化生效。`);
    } else {
      console.log(`[提示] 请重新启动您的 Antigravity ${targetLabel} 以使更改生效。`);
    }
  } catch (err) {
    console.error(`\n\x1b[31m[ERROR] 执行失败，请检查上方控制台报错。\x1b[0m`);
    process.exit(1);
  }
}

function cancelAction() {
  rl.close();
  console.log(`\n[INFO] 操作已取消。`);
  process.exit(0);
}

rl.question('请输入选项 [1-5]: ', (answer) => {
  const choice = answer.trim();
  if (choice === '1' || choice === '') {
    executeAction('translate', 'antigravity');
  } else if (choice === '2') {
    executeAction('rollback', 'antigravity');
  } else if (choice === '3') {
    executeAction('translate', 'ide');
  } else if (choice === '4') {
    executeAction('rollback', 'ide');
  } else if (choice === '5') {
    cancelAction();
  } else {
    console.log(`\x1b[31m[WARNING] 无效的选择 "${choice}"，自动退出。\x1b[0m`);
    cancelAction();
  }
});
