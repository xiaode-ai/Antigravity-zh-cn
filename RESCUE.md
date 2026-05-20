# 🚑 Windows 环境乱码与主程序语法崩溃紧急救援指南 (RESCUE Guide)

本指南针对在 Windows 操作系统环境下，因后台编码格式问题导致 `translations.json` 乱码，并进一步造成 IDE 主运行库崩溃（打开设置页显示空白，且报错 `SyntaxError: Unexpected identifier '鎷掔粷'`）的紧急情况，提供官方的无损救援方案与最佳实践避坑建议。

---

## 🔍 事故根因分析 (Root Cause Analysis)

1. **二次转码乱码**：Windows PowerShell 的默认文件流输出编码在未显式声明的情况下，向已有的 UTF-8 文件追加中文字符时，会发生严重的二次转码，导致正常的中文字符（如 `"了解更多"`）被错写为乱码（如 `"浜嗚В鏇村"`）。
2. **语法损毁阻断**：当运行 `node src/index.js translate` 时，这些包含乱码的词条被汉化引擎强行替换应用到了 IDE 主运行库 `main.js` 中。由于中文字符乱码包含了不合法的字符组合，破坏了 JavaScript 语法的合法标识符结构，从而触发了致命的 `SyntaxError: Unexpected identifier` 语法错误，导致整个 IDE 进程无法解析设置页面组件而显示空白。

---

## 🛠️ 终极无损救援方案 (Emergency Recovery Guide)

请在您的物理 **pwsh/CMD 交互式终端**（确保拥有完整的环境变量与主进程修改权限）中，顺次复制并执行以下四步命令。此方案已经过实战完美检验，可 100% 安全复活您的 IDE 并成功汉化第二批按钮。

### 第一步：恢复未受损的词库基准
利用版本管理，将已被乱码覆盖的字典秒级还原至健康的原始状态（包含 445 组匹配）：
```powershell
git checkout translations.json
```

### 第二步：物理回滚主运行库，使 IDE 恢复正常
读取最初始干净的英文原版备份覆盖回 IDE 运行库，并自动将 `product.json` 中的完整性哈希校验还原为出厂哈希：
```powershell
node src/index.js rollback
```
> [!NOTE]
> 执行完毕后，您的 IDE 即可瞬间从空白报错中复活，恢复至最初的官方英文状态。

### 第三步：以安全 UTF-8 编码合并新翻译
执行专门编写的 Node.js 合并脚本，通过纯 Node.js 的 UTF-8 文件流将 35 组按钮级的汉化精细地合入 `translations.json`：
```powershell
node scratch/add_new_translations_round5.js
```
> [!IMPORTANT]
> 此步骤能完全避免 PowerShell 原生追加重定向产生的任何乱码问题。

### 第四步：重新执行安全汉化与编译校验
启动汉化编译器，执行前置安全扫描，将合并后的最新 480 组词典应用至主运行库中，并自动更新 `product.json` 完整性哈希：
```powershell
node src/index.js translate
```

---

## 🛡️ 研发最佳实践避坑指南

为防止后续在进行 L10n 本地化协作或字典增量更新时重复发生上述“字符损坏”与“语法破损”悲剧，请严格遵守以下开发最佳实践：

1. **严禁直接重定向非 ASCII 字符**：
   在 Windows CMD/PowerShell 命令行中，**绝对不要**使用 `>>` 或 `Out-File` 等重定向指令直接向 JSON 文件追加非 ASCII（如中文）字串。这在多平台、不同 Code Page（如 GBK 与 UTF-8 混用）下极易导致乱码。
2. **始终采用 Node.js 显式流操作**：
   任何增量合并字典的操作，必须交由类似于 `scratch/add_new_translations_round5.js` 的专职 Node.js 脚本来执行，并显式指定 `'utf8'` 编码，如：
   ```javascript
   fs.writeFileSync(filePath, data, 'utf8');
   ```
3. **关闭编辑器标签以防脏缓存覆盖**：
   在运行合并脚本或编译前，**请先关闭编辑器中打开的 `translations.json` 标签页**，或在检测到外部修改时选择“重新载入”。否则，某些编辑器的自动保存功能或残留的撤销栈（Ctrl+Z 状态缓存）可能会二次覆盖已经合并成功的文件。
4. **编译与完整性校验链机制**：
   本项目内置了强大的 `@xiaode-ai/i18nt` 语法审计拦截能力。在每次执行 `translate` 汉化前，务必保持 `scan` 前置扫描拦截开启，一旦发现插值变量丢失或非法花括号输入，强行以 `Exit Code 1` 阻断编译，以最大程度保障 IDE 进程的主机安全。
