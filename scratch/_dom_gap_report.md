# DOM 字典与静态翻译差距分析报告

## 概要

- **DOM 字典当前条目数**: 325 个
- **dom-untranslated.json 报告的 unknown 条目**: 194 个
- **partial（拼接异常）条目**: 2 个

本报告基于 `dom-untranslated.json`（2026-06-18 生成）与 `translations.json` 中嵌入的 DOM 注入字典的逐条比对，识别出所有尚未被自动化翻译覆盖的字符串，并提供精确的键值对以添加。

---

## 第一部分：根因分析

### 1.1 DOM 字典键与实际 DOM 文本不匹配（最主要原因）

DOM 注入字典有 **30 个半翻译键**（键中包含中文字符）。这些键是在静态翻译（`translations.json` 的 `old→new` 替换）应用后，为了匹配已被部分翻译的 DOM 文本而创建的。但其中一些键与实际 DOM 文本仍有偏差：

| 当前字典键 | 实际 DOM 文本 | 差异原因 |
|---|---|---|
| `通过 Model 上下文 Protocol 配置外部工具。` | `MCP 工具通过 Model 上下文 Protocol 配置外部工具。` | DOM 文本含前缀 `MCP 工具`（来自另一个元素拼接） |
| `To modify editor settings, open 设置 within the editor window.` | `编辑器 设置To modify editor settings, open 设置 within the editor window.` | DOM 拼接了 section heading `编辑器` + 子标题 |
| `Manage your notification preferences.` / `manage your notification preferences.` | `管理 your notification preferences.` | 静态翻译已将 `Manage` → `管理`，但 DOM 字典键仍为英文开头 |

### 1.2 字典值残留英文

部分字典条目的值（翻译结果）仍包含未翻译的英文：

| 键 | 当前值 | 残留英文 |
|---|---|---|
| `通过 Model 上下文 Protocol 配置外部工具。` | `通过 Model Context Protocol 配置外部工具。` | Model, Context, Protocol |
| `使用 Firebase 原型设计、构建和运行用户喜爱的现代应用's backend, AI, and operational infrastructure.` | `使用 Firebase 原型设计、构建和运行用户喜爱的现代应用的后端、AI 和运维基础设施。` | (无残留，但键已失效) |

### 1.3 DOM 文本节点拼接

DOM 扫描器捕获的是**父级元素的完整文本内容**，会包含多个子元素拼接的文本。例如：
- `"MCP 工具通过 Model 上下文 Protocol 配置外部工具。打开"` — 这是 section heading "MCP 工具" + description + button "打开" 的拼接
- `"布局控制切换侧边栏CtrlB切换辅助面板CtrlShiftBZoom InCtrl=Zoom OutCtrl-重置缩放Ctrl0"` — 多个快捷键行的拼接

这类拼接不需要作为字典条目添加，应该通过确保每个独立子元素的文本都被字典覆盖来解决。

---

## 第二部分：需要添加到 DOM 字典的新条目

### 2.1 纯英文 UI 字符串（DOM 字典完全缺失）

以下英文字符串出现在 DOM 中，但字典中没有任何匹配：

| # | 英文原文（字典键） | 建议中文翻译（字典值） | 来源/上下文 |
|---|---|---|---|
| 1 | `Marketplace` | `市场` | 设置页-自定义-市场区块标题 |
| 2 | `Marketplace Gallery URL` | `市场画廊 URL` | 设置页-自定义-市场画廊地址 |
| 3 | `Marketplace Item URL` | `市场项目 URL` | 设置页-自定义-市场项目地址 |
| 4 | `Changes the base URL for marketplace search results. You must restart Antigravity to use the new marketplace after changing this value.` | `更改市场搜索结果的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。` | 市场画廊 URL 描述 |
| 5 | `Changes the base URL on each extension page. You must restart Antigravity to use the new marketplace after changing this value.` | `更改每个扩展页面的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。` | 市场项目 URL 描述 |
| 6 | `Setup` | `设置` | Jetski Chat 设置区标题 |
| 7 | `Setup Jetski Chat` | `设置 Jetski 聊天` | Jetski Chat 按钮/标题 |
| 8 | `Jetski Chat` | `Jetski 聊天` | Jetski Chat 区块标题 |
| 9 | `Configure a chat bot so you can use Jetski directly from Google Chat.` | `配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。` | Jetski Chat 描述 |
| 10 | `Configure a chat bot so you can use Jetski directly from Google Chat. For help, visit go/jetski-chat or join the chat space.` | `配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。如需帮助，请访问 go/jetski-chat 或加入聊天空间。` | Jetski Chat 完整描述 |
| 11 | `For help, visit` | `如需帮助，请访问` | Jetski Chat 帮助链接前缀 |
| 12 | `or join the` | `或加入` | Jetski Chat 帮助链接连接词 |
| 13 | `chat space` | `聊天空间` | Jetski Chat 聊天空间链接 |
| 14 | `Bot Name` | `机器人名称` | Jetski Chat 设置字段 |
| 15 | `Avatar URL` | `头像 URL` | Jetski Chat 设置字段 |
| 16 | `Enter bot name (optional)` | `输入机器人名称（可选）` | Jetski Chat 输入框 placeholder |
| 17 | `Enter avatar URL (optional)` | `输入头像 URL（可选）` | Jetski Chat 输入框 placeholder |
| 18 | `Configure a chat bot so you can use Jetski directly from Google Chat. For help, visit go/jetski-chat or join the chat space.` | `配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。如需帮助，请访问 go/jetski-chat 或加入聊天空间。` | Jetski Chat 描述 |
| 19 | `Google Drive integration not available` | `Google Drive 集成不可用` | 通知/提示信息 |
| 20 | `Claude and GPT models` | `Claude 和 GPT 模型` | 配额页-模型分组标签 |
| 21 | `Typeahead menu` | `自动补全菜单` | 编辑器设置-自动补全选项 |
| 22 | `Selection Actions` | `选择操作` | 编辑器设置-选择操作标题 |
| 23 | `Google Antigravity SDK` | `Google Antigravity SDK` | 插件卡片标题（品牌名保留英文） |
| 24 | `Dart and Flutter` | `Dart 和 Flutter` | 插件卡片标题 |

### 2.2 需修复的现有字典条目（值残留英文）

| # | 当前键 | 当前值 | 建议修正值 |
|---|---|---|---|
| 1 | `通过 Model 上下文 Protocol 配置外部工具。` | `通过 Model Context Protocol 配置外部工具。` | `通过模型上下文协议配置外部工具。` |
| 2 | `Configure external tools via Model Context Protocol.` | `通过 Model Context Protocol 配置外部工具。` | `通过模型上下文协议配置外部工具。` |

### 2.3 需要添加的"混合前缀"字典条目

由于 DOM 文本拼接，以下条目需要额外添加以覆盖实际 DOM 中的拼接文本：

| # | 字典键 | 字典值 | 说明 |
|---|---|---|---|
| 1 | `MCP 工具通过 Model 上下文 Protocol 配置外部工具。` | `MCP 工具通过模型上下文协议配置外部工具。` | 覆盖"MCP 工具"标题+描述的拼接 |
| 2 | `管理 your notification preferences.` | `管理您的通知偏好。` | 覆盖静态翻译残留的 manage→管理 未完整翻译 |
| 3 | `显示 Selection Actions` | `显示选择操作` | 覆盖"Show"已被静态翻译但"Selection Actions"未覆盖的情况 |
| 4 | `显示 \"编辑\" and \"Chat\" buttons when selecting text in the editor.` | `在编辑器中选择文本时显示"编辑"和"对话"按钮。` | 覆盖 Show Selection Actions 子描述的混合文本 |
| 5 | `刷新 quota and credits data` | `刷新配额和点数数据` | 覆盖 quota 刷新按钮文本 |
| 6 | `Actuation 权限` | `执行权限` | 覆盖 "Browser Actuation Permissions" 被静态翻译后的残留 |
| 7 | `Go to 项目` | `前往项目` | 覆盖小写 go（区别于 Go To） |

---

## 第三部分：不需要翻译的项目（可安全忽略）

### 3.1 键盘快捷键（共 16 个）

`Ctrl`, `CtrlB`, `CtrlF`, `CtrlK`, `CtrlL`, `CtrlM`, `CtrlN`, `CtrlP`, `CtrlU`, `Ctrl-`, `Ctrl,`, `Ctrl[`, `Ctrl]`, `Ctrl/`, `Ctrl=`, `Ctrl0`, `CtrlShiftB`, `Alt`, `Alt↑`, `Alt↓`, `Shift`

这些是快捷键标签，保持英文是标准做法。

### 3.2 颜色值与标识符（共 5 个）

`007acc`, `cccccc`, `EEEEEE`, `auth-and-billing`, `bug-report`, `feature-request`, `general-feedback`

### 3.3 品牌名与技术术语（不需要翻译或保留英文）

`Google Chrome`, `Chrome DevTools`, `Google Antigravity SDK`（品牌名）

### 3.4 用户个人数据（不应翻译）

`ixcgh123@gmail.com`

### 3.5 内部 URL/路径（不应翻译）

`go/jetski-chat`

---

## 第四部分：partial 拼接修复

`dom-untranslated.json` 中有 2 条 partial 条目，均为同一段文本的不同截取：

**原文（DOM 扫描到的混合文本）**:
```
浏览器设置Configure the browser subagent. It requires Google Chrome to be installed. 可通过在对话输入框中输入 /browser 来调用浏览器子智能体。
```

**当前字典已有完整覆盖**：
- `Configure the browser subagent. It requires Google Chrome to be installed.` → `配置浏览器子智能体。需要安装 Google Chrome。`

**问题**：DOM 扫描器捕获了 section heading "浏览器设置" 与描述的拼接文本。字典已能正确处理子元素级别的翻译，无需额外操作。此 partial 为扫描器层面的假阳性。

---

## 第五部分：可直接使用的 JSON 格式键值对

以下 JSON 对象可直接合并到 DOM 注入脚本的 `dictionary` 对象中：

```json
{
  "Marketplace": "市场",
  "Marketplace Gallery URL": "市场画廊 URL",
  "Marketplace Item URL": "市场项目 URL",
  "Changes the base URL for marketplace search results. You must restart Antigravity to use the new marketplace after changing this value.": "更改市场搜索结果的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。",
  "Changes the base URL on each extension page. You must restart Antigravity to use the new marketplace after changing this value.": "更改每个扩展页面的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。",
  "Setup": "设置",
  "Setup Jetski Chat": "设置 Jetski 聊天",
  "Jetski Chat": "Jetski 聊天",
  "Configure a chat bot so you can use Jetski directly from Google Chat.": "配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。",
  "Configure a chat bot so you can use Jetski directly from Google Chat. For help, visit go/jetski-chat or join the chat space.": "配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。如需帮助，请访问 go/jetski-chat 或加入聊天空间。",
  "For help, visit": "如需帮助，请访问",
  "or join the": "或加入",
  "chat space": "聊天空间",
  "Bot Name": "机器人名称",
  "Avatar URL": "头像 URL",
  "Enter bot name (optional)": "输入机器人名称（可选）",
  "Enter avatar URL (optional)": "输入头像 URL（可选）",
  "Google Drive integration not available": "Google Drive 集成不可用",
  "Claude and GPT models": "Claude 和 GPT 模型",
  "Typeahead menu": "自动补全菜单",
  "Selection Actions": "选择操作",
  "Dart and Flutter": "Dart 和 Flutter",
  "MCP 工具通过 Model 上下文 Protocol 配置外部工具。": "MCP 工具通过模型上下文协议配置外部工具。",
  "管理 your notification preferences.": "管理您的通知偏好。",
  "显示 Selection Actions": "显示选择操作",
  "显示 \"编辑\" and \"Chat\" buttons when selecting text in the editor.": "在编辑器中选择文本时显示\"编辑\"和\"对话\"按钮。",
  "刷新 quota and credits data": "刷新配额和点数数据",
  "Actuation 权限": "执行权限",
  "Go to 项目": "前往项目"
}
```

---

## 第六部分：需要修正的现有字典条目

以下 2 条现有字典条目的值需要更新：

```json
{
  "通过 Model 上下文 Protocol 配置外部工具。": "通过模型上下文协议配置外部工具。",
  "Configure external tools via Model Context Protocol.": "通过模型上下文协议配置外部工具。"
}
```

---

## 统计总结

| 类别 | 数量 |
|---|---|
| 需新增到 DOM 字典的纯英文条目 | 24 |
| 需新增的混合前缀条目（覆盖拼接） | 7 |
| 需修正值的现有条目 | 2 |
| **合计需要操作** | **33** |
| 可安全忽略的快捷键/标识符 | ~22 |
| 扫描器假阳性（拼接/品牌名/个人数据） | ~70 |
| 已被字典正确覆盖的条目 | ~70 |
