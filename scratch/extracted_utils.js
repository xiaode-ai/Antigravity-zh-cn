"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepBlocker = exports.showOrCreateWindow = exports.showQuitConfirmation = void 0;
exports.setShowQuitConfirmation = setShowQuitConfirmation;
exports.isMacOS = isMacOS;
exports.createWindow = createWindow;
exports.getNodeWrapperPaths = getNodeWrapperPaths;
exports.setupNodeWrapper = setupNodeWrapper;
const electron_1 = require("electron");
const constants_1 = require("./constants");
const keybindings_1 = require("./keybindings");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const paths_1 = require("./paths");
const loadingOverlay_1 = require("./loadingOverlay");
exports.showQuitConfirmation = false;
function setShowQuitConfirmation(value) {
    exports.showQuitConfirmation = value;
}
function isMacOS() {
    return process.platform === 'darwin';
}
/**
 * Reads the user's theme preference from the settings file.
 */
function getThemeMode() {
    try {
        const filePath = (0, paths_1.getSettingsPbPath)();
        if (!fs.existsSync(filePath)) {
            return 'DARK';
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        const config = JSON.parse(content);
        const themeMode = config?.userSettings?.themeMode;
        if (themeMode && themeMode.includes('INHERIT')) {
            return electron_1.nativeTheme.shouldUseDarkColors ? 'DARK' : 'LIGHT';
        }
        if (themeMode && themeMode.includes('LIGHT')) {
            return 'LIGHT';
        }
        return 'DARK';
    }
    catch (e) {
        console.error('Error reading theme mode:', e);
        return 'DARK';
    }
}
/**
 * Ensures the app is visible in the dock for MacOS with the icon set.
 * When refocusing the app after being hidden in the dock, the icon is sometimes lost.
 * This ensures the icon is always visible.
 */
function ensureAppIsInDock() {
    void electron_1.app.dock?.show();
    if (isMacOS() && electron_1.app.dock) {
        const iconPath = path_1.default.join(__dirname, '..', 'icon.png');
        electron_1.app.dock.setIcon(electron_1.nativeImage.createFromPath(iconPath));
    }
}
// ---------------------------------------------------------------------------
// Window Management
// ---------------------------------------------------------------------------
/**
 * Creates and returns a new BrowserWindow pointed at `url`.
 * Uses a hidden title bar with native traffic lights on macOS.
 * Node integration is disabled and context isolation is enabled for security.
 */
function createWindow(url) {
    ensureAppIsInDock();
    const theme = getThemeMode().toUpperCase();
    const isLight = theme.includes('LIGHT');
    const backgroundColor = isLight ? '#FAFAFA' : '#131313';
    const foregroundColor = isLight ? '#383A42' : '#FAFAFA';
    const win = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 500,
        minHeight: 400,
        title: electron_1.app.getName(),
        icon: path_1.default.join(__dirname, '..', 'icon.png'),
        titleBarStyle: 'hidden',
        titleBarOverlay: isMacOS()
            ? false
            : {
                color: backgroundColor,
                symbolColor: foregroundColor,
                height: 30,
            },
        backgroundColor,
        trafficLightPosition: { x: 12, y: 12 },
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, 'preload.js'),
            devTools: !electron_1.app.isPackaged,
        },
    });
    // Prevent the menu dropdown from being very wide due to long page titles
    win.on('page-title-updated', (event, title) => {
        const maxLength = 25;
        if (title.length > maxLength) {
            event.preventDefault();
            win.setTitle(title.substring(0, maxLength) + '...');
        }
    });
    win.webContents.setWindowOpenHandler((details) => {
        void electron_1.shell.openExternal(details.url);
        return { action: 'deny' };
    });
    (0, loadingOverlay_1.attachLoadingOverlay)(win, foregroundColor, backgroundColor);
    (0, keybindings_1.registerKeybindings)(win, {
        createNewWindow: () => {
            void createWindow(url);
        },
        onQuitRequested: () => {
            exports.showQuitConfirmation = true;
            electron_1.app.quit();
        },
    });
    win.webContents.on('dom-ready', () => {
        win.webContents.executeJavaScript("(() => {\n    const dictionary = {\"Settings\":\"设置\",\"General\":\"常规\",\"Account\":\"账户\",\"Permissions\":\"权限\",\"Appearance\":\"外观\",\"Notifications\":\"通知\",\"Models\":\"模型\",\"Customizations\":\"自定义\",\"Browser\":\"浏览器\",\"Tab\":\"标签页\",\"Editor\":\"编辑器\",\"App\":\"应用\",\"Best of N\":\"Best of N\",\"Shortcuts\":\"快捷键\",\"Provide Feedback\":\"提供反馈\",\"Workspaces\":\"工作区\",\"Projects\":\"项目\",\"Not in Project\":\"非项目中\",\"Conversations\":\"对话\",\"Show all\":\"显示全部\",\"Agent\":\"智能体\",\"Manage\":\"管理\",\"Network\":\"网络\",\"Network Permissions\":\"网络权限\",\"Network Access Rules\":\"网络访问规则\",\"Configure allowed and denied URLs for reading.\":\"配置允许和拒绝读取的 URL。\",\"Open\":\"打开\",\"Allowed URLs\":\"允许的 URL\",\"Denied URLs\":\"拒绝的 URL\",\"Allow\":\"允许\",\"Deny\":\"拒绝\",\"Add Rule\":\"添加规则\",\"Remove\":\"移除\",\"Save\":\"保存\",\"Cancel\":\"取消\",\"Close\":\"关闭\",\"Reset\":\"重置\",\"Edit\":\"编辑\",\"Delete\":\"删除\",\"Manage your plan, credentials, and general preferences.\":\"管理您的方案、凭证和通用偏好。\",\"Enable Telemetry\":\"启用遥测\",\"When toggled on, Antigravity collects usage data to help Google enhance performance and features.\":\"开启后，Antigravity 会收集使用数据，以帮助 Google 改进性能和功能。\",\"Marketing Emails\":\"营销邮件\",\"Receive product updates, tips, and promotions from Google Antigravity via email.\":\"通过电子邮件接收来自 Google Antigravity 的产品更新、技巧和促销信息。\",\"Your Plan: Google AI Pro\":\"您的方案：Google AI Pro\",\"Your Plan:\":\"您的方案：\",\"You can upgrade to a Google AI Ultra plan to receive higher rate limits.\":\"您可以升级到 Google AI Ultra 方案以获得更高的速率限制。\",\"Upgrade\":\"升级\",\"Email\":\"邮箱\",\"Sign Out\":\"退出登录\",\"By using this app, you agree to its\":\"使用本应用即表示您同意其\",\"Terms of Service\":\"服务条款\",\"New Conversation\":\"新建对话\",\"Conversation History\":\"对话历史\",\"Scheduled Tasks\":\"计划任务\",\"No conversations yet\":\"暂无对话\",\"Select Project\":\"选择项目\",\"Ask anything, @ to mention, / for actions\":\"输入任何问题，@ 提及，/ 执行动作\",\"Install IDE\":\"安装 IDE\",\"Always Ask\":\"每次询问\",\"Always Proceed\":\"始终执行\",\"Request Review\":\"请求审核\",\"Disabled\":\"已禁用\",\"Enabled\":\"已启用\",\"Limited\":\"受限\",\"Default\":\"默认\",\"Advanced\":\"高级\",\"Learn More\":\"了解更多\",\"Docs\":\"文档\",\"Report Issue\":\"报告问题\",\"Changelog\":\"更新日志\",\"Profile\":\"个人资料\",\"Error\":\"错误\",\"Unknown Error\":\"未知错误\",\"Loading\":\"正在加载\",\"Retry\":\"重试\",\"Done\":\"完成\",\"Add context\":\"添加上下文\",\"Display Options\":\"显示选项\",\"File\":\"文件\",\"Go Back\":\"后退\",\"Go Forward\":\"前进\",\"Message input\":\"消息输入\",\"Record voice memo\":\"录制语音备忘录\",\"Sidebar\":\"侧边栏\",\"Toggle Sidebar\":\"切换侧边栏\",\"View\":\"视图\",\"Window\":\"窗口\",\"默认 Dark\":\"默认深色\",\"默认 Light\":\"默认浅色\",\"默认 System\":\"默认跟随系统\",\"Project-Specific 设置\":\"项目专属设置\",\"Network 权限\":\"网络权限\",\"Terminal & Tooling 权限\":\"终端与工具权限\",\"File 权限\":\"文件权限\",\"Go To 项目\":\"前往项目\",\"Preset\":\"预设\",\"Dark\":\"深色\",\"Light\":\"浅色\",\"System\":\"跟随系统\",\"Go To\":\"前往\",\"Terminal & Tooling\":\"终端与工具\",\"Configure global allowed and denied resource permissions.\":\"配置全局允许和拒绝的资源权限。\",\"Learn more\":\"了解更多\",\"Project-Specific\":\"项目专属\",\"Project-Specific Settings\":\"项目专属设置\",\"Modify scoped permissions, folders, and agent settings like Sandbox and Terminal Command Execution.\":\"修改作用域权限、文件夹，以及沙盒和终端命令执行等智能体设置。\",\"File Access Rules\":\"文件访问规则\",\"Configure allowed and denied paths for file reads and writes.\":\"配置允许和拒绝文件读写的路径。\",\"Terminal Commands\":\"终端命令\",\"Configure allowed terminal commands.\":\"配置允许的终端命令。\",\"Commands Outside Sandbox\":\"沙盒外命令\",\"Configure allowed commands outside the sandbox.\":\"配置允许在沙盒外执行的命令。\",\"MCP Tools\":\"MCP 工具\",\"Configure external tools via Model Context Protocol.\":\"通过模型上下文协议配置外部工具。\",\"Configure the agent's visual theme and display preferences.\":\"配置智能体的视觉主题和显示偏好。\",\"Verbose agent chat\":\"详细智能体对话\",\"Display and preserve intermediate thinking steps\":\"显示并保留中间思考步骤\",\"Select light, dark, or inherit system settings.\":\"选择浅色、深色或跟随系统设置。\",\"Background\":\"背景色\",\"Foreground\":\"前景色\",\"Accent\":\"强调色\",\"Chat Settings\":\"对话设置\",\"Browser Settings\":\"浏览器设置\",\"Enable Browser Tools\":\"启用浏览器工具\",\"Browser Actuation Permissions\":\"浏览器执行权限\",\"Browser Actuation Rules\":\"浏览器执行规则\",\"Configure allowed and denied URLs for browser actuation.\":\"配置允许和拒绝的浏览器执行 URL。\",\"Chrome Binary Path\":\"Chrome 可执行文件路径\",\"Browse\":\"浏览\",\"Path to the Chrome/Chromium executable. Leave empty for auto-detection.\":\"Chrome/Chromium 可执行文件路径。留空以自动检测。\",\"Browser User Profile Path\":\"浏览器用户配置文件路径\",\"Browser CDP Port\":\"浏览器 CDP 端口\",\"Port number for Chrome DevTools Protocol remote debugging.\":\"Chrome DevTools Protocol 远程调试端口号。\",\"Enable Workspace API\":\"启用 Workspace API\",\"When enabled, Agent can use browser tools to open URLs, read web pages, and interact with browser content.\":\"启用后，智能体可使用浏览器工具打开 URL、阅读网页并与浏览器内容交互。\",\"Browser Javascript Execution Policy\":\"浏览器 JavaScript 执行策略\",\"Controls whether the agent can run custom JavaScript to automate complex browser actions.\":\"控制智能体是否可以运行自定义 JavaScript 来自动化复杂的浏览器操作。\",\"Notification Settings\":\"通知设置\",\"Sound Effects\":\"音效\",\"Desktop Notifications\":\"桌面通知\",\"Autocomplete Speed\":\"自动补全速度\",\"Navigation\":\"导航\",\"Context\":\"上下文\",\"Fast\":\"快速\",\"Slow\":\"慢速\",\"Tab to Accept\":\"Tab 接受\",\"Highlight After Accept\":\"接受后高亮\",\"Disable Tab to Import\":\"禁用 Tab 导入\",\"Tab to Jump\":\"Tab 跳转\",\"Allow Tab Access to .gitignore Files\":\"允许 Tab 访问 .gitignore 文件\",\"Model Credits\":\"模型点数\",\"Enable AI Credit Overages\":\"启用 AI 超额点数\",\"Review Policy\":\"审核策略\",\"Terminal Command Auto Execution\":\"终端命令自动执行\",\"Open System Preferences\":\"打开系统偏好设置\",\"Sandbox\":\"沙盒\",\"Enter URL pattern...\":\"输入 URL 模式...\",\"Copy debug info\":\"复制调试信息\",\"See less\":\"收起\",\"Browser allowlist begins with localhost and can be updated through the settings page.\":\"浏览器白名单以 localhost 开头，可通过设置页面更新。\",\"The browser subagent can be invoked by typing /browser in the conversation input box.\":\"可通过在对话输入框中输入 /browser 来调用浏览器子智能体。\",\"浅色 Theme\":\"浅色主题\",\"深色 Theme\":\"深色主题\",\"跟随系统 Theme\":\"跟随系统主题\",\"When toggled on, Antigravity will use your AI credits to fulfill model requests once you're out of model quota. Antigravity will always use your model quota first before using AI credits.\":\"开启后，当您用完模型配额时，Antigravity 将使用您的 AI 点数来满足模型请求。Antigravity 始终会优先使用模型配额，再使用 AI 点数。\",\"Available AI Credits\":\"可用 AI 点数\",\"See Activity\":\"查看活动\",\"Get More AI Credits\":\"获取更多 AI 点数\",\"Model Quota\":\"模型配额\",\"Weekly Limit\":\"每周限额\",\"Five Hour Limit\":\"五小时限额\",\"You have used some of your weekly limit, it will fully refresh in\":\"您已使用了部分每周限额，将在以下时间后完全刷新：\",\"Refresh\":\"刷新\",\"Plan\":\"方案\",\"Loading Antigravity\":\"正在加载 Antigravity\",\"Within each group, models share a weekly limit and a 5-hour limit. Quota is consumed proportionally to the cost of the tokens. Thus, limits will last longer with shorter tasks or using more cost-effective models. The 5-hour limit smooths out aggregate demand to fairly distribute global capacity across all users, while your weekly limit is tied directly to your individual tier.\":\"在每个分组中，模型共享每周限额和 5 小时限额。配额的消耗与 Token 的成本成正比。因此，较短的任务或使用更具性价比的模型将使限额持续更久。5 小时限额可平滑总体需求，公平分配全球容量给所有用户，而您的每周限额则直接与您的个人等级挂钩。\",\"hours\":\"小时\",\"minutes\":\"分钟\",\"hour\":\"小时\",\"minute\":\"分钟\",\"Configure default behaviors, skills, and MCP servers.\":\"配置默认行为、技能和 MCP 服务器。\",\"Token Usage\":\"Token 用量\",\"The breakdown below shows token usage from customizations like skills, rules, and MCP. If the budget is exceeded, large customizations will be truncated automatically.\":\"以下明细显示了技能、规则和 MCP 等自定义项的 Token 用量。如果超出预算，较大的自定义项将被自动截断。\",\"of the customization budget is available.\":\"的自定义预算可用。\",\"Skills (\":\"技能 (\",\"Rules (\":\"规则 (\",\"Show\":\"显示\",\"breakdowns\":\"个明细\",\"breakdown\":\"个明细\",\"Global\":\"全局\",\"Plugin:\":\"插件：\",\"Retrieve and analyze AlphaFold predicted structures\":\"检索并分析 AlphaFold 预测结构\",\"Analyzes genetic variant effects\":\"分析遗传变异效应\",\"Orchestrates Android development tasks\":\"编排 Android 开发任务\",\"Query the ChEMBL database\":\"查询 ChEMBL 数据库\",\"Installed MCP Servers\":\"已安装的 MCP 服务器\",\"No MCP Servers\":\"无 MCP 服务器\",\"You currently don't have any MCP Servers installed. Add an MCP server above\":\"您当前没有安装任何 MCP 服务器。在上方添加一个 MCP 服务器\",\"You currently don’t have any MCP Servers installed. Add an MCP server above\":\"您当前没有安装任何 MCP 服务器。在上方添加一个 MCP 服务器\",\"Build With Google Plugins\":\"使用 Google 插件构建\",\"Customize\":\"自定义\",\"Configure the browser subagent. It requires Google Chrome to be installed.\":\"配置浏览器子智能体。需要安装 Google Chrome。\",\"Prevent Sleep\":\"防止休眠\",\"Prevent the computer from sleeping while the app is running.\":\"应用运行时防止计算机休眠。\",\"Keep In Menu Bar\":\"保留在菜单栏\",\"The app will be accessible from the menu bar and will keep running in the background when all windows are closed.\":\"应用可从菜单栏访问，并在所有窗口关闭时继续在后台运行。\",\"To modify notification settings, open your operating system's system preferences.\":\"要修改通知设置，请打开操作系统的系统偏好设置。\",\"Manage project folders, agent settings, and permissions.\":\"管理项目文件夹、智能体设置和权限。\",\"Manage agent settings and permissions for conversations outside of projects.\":\"管理项目外对话的智能体设置和权限。\",\"Folders\":\"文件夹\",\"No folders added yet.\":\"尚未添加文件夹。\",\"+ Add Folder\":\"+ 添加文件夹\",\"Choose a predefined security preset for the agent. This controls terminal auto-execution policy, and file access policy.\":\"为智能体选择预定义的安全预设。这将控制终端自动执行策略和文件访问策略。\",\"Outside of folders file access policy\":\"文件夹外文件访问策略\",\"Configures how the agent tries to access files outside of its working folders.\":\"配置智能体如何尝试访问其工作文件夹之外的文件。\",\"Controls whether terminal commands require your approval before running.\":\"控制终端命令在运行前是否需要您的批准。\",\"Specifies agent's behavior when asking for review on artifacts, which are documents it creates to enable a richer conversation experience.\":\"指定智能体在请求审核产物时的行为，产物是为实现更丰富对话体验而创建的文档。\",\"Custom\":\"自定义\",\"Require Review\":\"需要审核\",\"(Medium)\":\"(中)\",\"(High)\":\"(高)\",\"(Low)\":\"(低)\",\"(Thinking)\":\"(思考)\",\"Limited time\":\"限时\",\"New Project\":\"新建项目\",\"Quick Start\":\"快速开始\",\"No Project\":\"无项目\",\"Create New Project\":\"创建新项目\",\"Record Audio\":\"录制音频\",\"Add Context\":\"添加上下文\",\"Project Settings\":\"项目设置\",\"New Chat in Project\":\"项目中新建对话\",\"Search conversations...\":\"搜索对话...\",\"Filter\":\"筛选\",\"+ New\":\"+ 新建\",\"Search tasks...\":\"搜索任务...\",\"No scheduled tasks configured.\":\"未配置计划任务。\",\"Artifact 审核策略\":\"产物审核策略\",\"Local 权限\":\"本地权限\",\"Security 预设\":\"安全预设\",\"智能体 设置\":\"智能体设置\",\"智能体 Behavior\":\"智能体行为\",\"管理 application settings.\":\"管理应用设置。\",\"常规 Feedback\":\"常规反馈\",\"Build with Antigravity Plugins\":\"使用 Antigravity 插件构建\",\"Core tools and knowledge required to develop for Android\":\"开发 Android 所需的核心工具和知识\",\"Modern Web Guidance\":\"现代 Web 指南\",\"Keep your coding agent up to date with the latest web best practices.\":\"让您的编码智能体保持最新的 Web 最佳实践。\",\"Google Antigravity SDK\":\"Google Antigravity SDK\",\"Using the Antigravity Python SDK to build AI agents\":\"使用 Antigravity Python SDK 构建 AI 智能体\",\"Science\":\"科学\",\"Curated collection of agent skills for science.\":\"精选的科学领域智能体技能集合。\",\"Prototype, build & run modern apps users love with Firebase\":\"使用 Firebase 原型设计、构建和运行用户喜爱的现代应用\",\"Add MCP\":\"添加 MCP\",\"Keyboard shortcuts for quick navigation and control.\":\"快速导航和控制的键盘快捷键。\",\"Open Conversation Picker\":\"打开对话选择器\",\"Open File Search\":\"打开文件搜索\",\"Focus Input\":\"聚焦输入\",\"File Picker\":\"文件选择器\",\"Select Previous Conversation\":\"选择上一个对话\",\"Select Next Conversation\":\"选择下一个对话\",\"Open Settings\":\"打开设置\",\"Feedback Type\":\"反馈类型\",\"Bug Report\":\"缺陷报告\",\"Feature Request\":\"功能请求\",\"Auth and Billing\":\"认证与账单\",\"Description\":\"描述\",\"Please describe the issue in detail. The more actionable your feedback, the quicker our team can address your request. Some helpful information includes:\":\"请详细描述问题。您的反馈越具体，我们的团队就能越快处理您的请求。以下信息会有所帮助：\",\"Steps to reproduce the issue\":\"重现问题的步骤\",\"Expected behavior\":\"预期行为\",\"Actual behavior\":\"实际行为\",\"Any error messages\":\"任何错误信息\",\"Any relevant information\":\"任何相关信息\",\"Describe the bug you encountered…\":\"描述您遇到的缺陷...\",\"Toggle Model Selector\":\"切换模型选择器\",\"Toggle Voice Recording\":\"切换语音录制\",\"Find in Pane\":\"在面板中查找\",\"Layout Controls\":\"布局控制\",\"Toggle Auxiliary Pane\":\"切换辅助面板\",\"Recommended\":\"推荐\",\"Conversation\":\"对话\",\"Steps to Reproduce\":\"重现步骤\",\"Please list the steps to reproduce the issue\":\"请列出重现问题的步骤\",\"Attach a screenshot (optional)\":\"附加截图（可选）\",\"Attach Antigravity server logs\":\"附加 Antigravity 服务器日志\",\"Submit\":\"提交\",\"Send feedback as\":\"以以下身份发送反馈：\",\"Block all browser JavaScript execution.\":\"阻止所有浏览器 JavaScript 执行。\",\"Prompt for approval before running browser scripts.\":\"运行浏览器脚本前提示审批。\",\"Allow full browser script execution without prompting.\":\"允许完全执行浏览器脚本，无需提示。\",\"重置 Zoom\":\"重置缩放\",\"Danger Zone\":\"危险区域\",\"Permanently delete\":\"永久删除\",\"Delete Project\":\"删除项目\",\"Rules\":\"规则\",\"Zoom In\":\"放大\",\"Zoom Out\":\"缩小\",\"Reset Zoom\":\"重置缩放\",\"Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer\":\"使用 Chrome DevTools 和 Puppeteer 在 Chrome 中进行可靠的自动化、深入调试和性能分析\",\"Skills providing tailored instructions for happy path Dart and Flutter development workflows.\":\"提供针对 Dart 和 Flutter 开发工作流量身定制的技能说明。\",\"Dart and Flutter\":\"Dart 和 Flutter\",\"Chrome DevTools\":\"Chrome DevTools\",\"Specifies 智能体's behavior when asking for review on artifacts, which are documents it creates to enable a richer conversation experience.\":\"指定智能体在请求审核产物时的行为，产物是为实现更丰富对话体验而创建的文档。\",\"使用 Firebase 原型设计、构建和运行用户喜爱的现代应用's backend, AI, and operational infrastructure.\":\"使用 Firebase 原型设计、构建和运行用户喜爱的现代应用的后端、AI 和运维基础设施。\",\"Delete 项目\":\"删除项目\",\"Configure editor-specific behaviors and shortcuts.\":\"配置编辑器特定的行为和快捷键。\",\"To modify editor settings, open 设置 within the editor window.\":\"要修改编辑器设置，请在编辑器窗口中打开设置。\",\"Configure tab completion, suggestions, and navigation behavior.\":\"配置标签页补全、建议和导航行为。\",\"Manage your notification preferences.\":\"管理您的通知偏好。\",\"manage your notification preferences.\":\"管理您的通知偏好。\",\"Show Selection Actions\":\"显示选择操作\",\"Show \\\"编辑\\\" and \\\"Chat\\\" buttons when selecting text in the editor.\":\"在编辑器中选择文本时显示\\\"编辑\\\"和\\\"对话\\\"按钮。\",\"We recommend attaching logs. Attaching logs will help the Antigravity team act on and prioritize your feedback.\":\"我们建议附加日志。附加日志将有助于 Antigravity 团队处理和优先处理您的反馈。\",\"刷新 quota and credits data\":\"刷新配额和点数数据\",\"refresh quota and credits data\":\"刷新配额和点数数据\",\"通过 Model 上下文 Protocol 配置外部工具。\":\"通过模型上下文协议配置外部工具。\",\"打开 编辑器 设置\":\"打开编辑器设置\",\"Describe the bug you encountered...\":\"描述您遇到的缺陷...\",\"Prototype, build & run modern apps users love with Firebase's backend, AI, and operational infrastructure.\":\"使用 Firebase 的后端、AI 和运维基础设施来原型设计、构建和运行用户喜爱的现代应用。\",\"General 通知 设置\":\"常规通知设置\",\"Marketplace\":\"市场\",\"Marketplace Gallery URL\":\"市场画廊 URL\",\"Marketplace Item URL\":\"市场项目 URL\",\"Changes the base URL for marketplace search results. You must restart Antigravity to use the new marketplace after changing this value.\":\"更改市场搜索结果的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。\",\"Changes the base URL on each extension page. You must restart Antigravity to use the new marketplace after changing this value.\":\"更改每个扩展页面的基准 URL。更改此值后，您必须重启 Antigravity 以使用新市场。\",\"Setup\":\"设置\",\"Setup Jetski Chat\":\"设置 Jetski 聊天\",\"Jetski Chat\":\"Jetski 聊天\",\"Configure a chat bot so you can use Jetski directly from Google Chat.\":\"配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。\",\"Configure a chat bot so you can use Jetski directly from Google Chat. For help, visit go/jetski-chat or join the chat space.\":\"配置聊天机器人，以便您可以直接从 Google Chat 使用 Jetski。如需帮助，请访问 go/jetski-chat 或加入聊天空间。\",\"For help, visit\":\"如需帮助，请访问\",\"or join the\":\"或加入\",\"chat space\":\"聊天空间\",\"Bot Name\":\"机器人名称\",\"Avatar URL\":\"头像 URL\",\"Enter bot name (optional)\":\"输入机器人名称（可选）\",\"Enter avatar URL (optional)\":\"输入头像 URL（可选）\",\"Google Drive integration not available\":\"Google Drive 集成不可用\",\"Claude and GPT models\":\"Claude 和 GPT 模型\",\"Typeahead menu\":\"自动补全菜单\",\"Selection Actions\":\"选择操作\",\"MCP 工具通过 Model 上下文 Protocol 配置外部工具。\":\"MCP 工具通过模型上下文协议配置外部工具。\",\"管理 your notification preferences.\":\"管理您的通知偏好。\",\"显示 Selection Actions\":\"显示选择操作\",\"Actuation 权限\":\"执行权限\",\"Go to 项目\":\"前往项目\",\"Selecting your Environment\":\"选择你的环境\",\"Use the environment selector to switch between working in existing folders and creating new worktrees.\":\"使用环境选择器在现有文件夹和新建工作树之间切换。\",\"worktrees\":\"工作树\",\"Environment\":\"环境\",\"including\":\"包括\",\"active conversations\":\"个活跃对话\",\"archived conversations\":\"个已归档对话\",\"Create Project\":\"创建项目\",\"Command Palette\":\"命令面板\",\"Minimize\":\"最小化\",\"Maximize\":\"最大化\",\"Version\":\"版本\",\"Check for Updates\":\"检查更新\",\"Skills\":\"技能\",\"Rules\":\"规则\",\"You currently don't have any MCP Servers installed.\":\"您当前没有安装任何 MCP 服务器。\",\"You currently don’t have any MCP Servers installed.\":\"您当前没有安装任何 MCP 服务器。\",\"Add an MCP server above\":\"在上方添加一个 MCP 服务器\",\"settings and permissions for conversations outside of projects.\":\"在项目之外对话的设置与权限。\",\"Requires manual review for all terminal commands and file accesses outside of the working folders.\":\"所有终端命令和工作文件夹之外的文件访问均需要手动审核。\",\"Full machine\":\"完全访问\",\"Full Machine\":\"完全访问\",\"All terminal commands require review. The agent can read or write to any file in the machine.\":\"所有终端命令均需审核。智能体可读写机器上的任何文件。\",\"Turbo mode\":\"极速模式\",\"Disables all safety barriers for maximal iteration velocity.\":\"禁用所有安全屏障，以实现最大迭代速度。\",\"Learn more about\":\"了解更多关于\",\"Agent Settings\":\"智能体设置\",\"Agent Behavior\":\"智能体行为\",\"Security Preset\":\"安全预设\",\"Local Permissions\":\"本地权限\",\"Artifact Review Policy\":\"产物审核策略\",\"Model Selection\":\"模型选择\",\"about Full machine\":\"关于完全访问\",\"智能体设置\":\"智能体设置\",\"智能体行为\":\"智能体行为\",\"安全预设\":\"安全预设\",\"Manually customize individual settings.\":\"手动自定义各项设置。\",\"Please describe the feature you'd like to see. The more detailed the requirements, the easier it will be for our team to incorporate your ideas. Some helpful information includes:\":\"请描述您希望看到的功能。需求越详细，我们的团队就越容易采纳您的想法。以下信息会有所帮助：\",\"What is missing in your workflow\":\"您的工作流程中缺少什么\",\"What you would like to see to address this gap in your workflow\":\"您希望看到什么来弥补工作流程中的这一空白\",\"How this feature would help you and other users\":\"此功能将如何帮助您和其他用户\",\"Describe the feature you would like to see...\":\"描述您希望看到的功能...\",\"Please describe your auth or billing issue. More details will help our support team resolve your issue quicker. Some helpful information includes:\":\"请描述您的认证或账单问题。更多细节将有助于我们的支持团队更快解决您的问题。以下信息会有所帮助：\",\"What quota or feature is being incorrectly limited\":\"哪些配额或功能被错误地限制了\",\"What functionality you expect your account tier to have available that is missing\":\"您期望您的账户级别拥有哪些缺失的功能\",\"Describe your auth or billing issue...\":\"描述您的认证或账单问题...\",\"For any feedback that does not fit into the above categories.\":\"适用于不属于上述类别的任何反馈。\",\"Enter your feedback here...\":\"在此输入您的反馈...\",\"Use the environment selector to switch between working in existing folders and creating new \":\"使用环境选择器在现有文件夹和新建\",\"Outside of folders file access policy\":\"文件夹外文件访问策略\",};\n    const keys = Object.keys(dictionary).sort((a, b) => b.length - a.length);\n    function translateText(value) {\n  if (!value || !/[A-Za-z]/.test(value)) return value;\n  const trimmed = value.trim();\n  if (!trimmed) return value;\n  const leadingSpaces = (value.match(/^\s*/) || [\"\"])[0];\n  const trailingSpaces = (value.match(/\s*$/) || [\"\"])[0];\n  if (dictionary[trimmed]) {\n    return leadingSpaces + dictionary[trimmed] + trailingSpaces;\n  }\n  const match = trimmed.match(/^([.,\/#!$%\^&\*;:{}=\-_`~()\"'?\s]*)(.*?)([.,\/#!$%\^&\*;:{}=\-_`~()\"'?\s]*)$/);\n  if (match) {\n    const prefix = match[1];\n    const core = match[2];\n    const suffix = match[3];\n    if (dictionary[core]) {\n      return leadingSpaces + prefix + dictionary[core] + suffix + trailingSpaces;\n    }\n  }\n  return value;\n}\n    const translateTextNode = (node) => {\n      const next = translateText(node.nodeValue);\n      if (next !== node.nodeValue) node.nodeValue = next;\n    };\n    const translateElementAttrs = (el) => {\n      if (!el || !el.getAttribute) return;\n      for (const attr of ['placeholder', 'aria-label', 'aria-description', 'title', 'alt', 'value']) {\n        const value = el.getAttribute(attr);\n        if (!value) continue;\n        const next = translateText(value);\n        if (next !== value) el.setAttribute(attr, next);\n      }\n    };\n    const walk = (root) => {\n      if (!root) return;\n      if (root.nodeType === Node.TEXT_NODE) {\n        translateTextNode(root);\n        return;\n      }\n      if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;\n      if (root.matches && root.matches('script,style,noscript,template')) return;\n      translateElementAttrs(root);\n      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {\n        acceptNode(node) {\n          const parent = node.parentElement;\n          if (!parent || parent.closest('script,style,noscript,template')) return NodeFilter.FILTER_REJECT;\n          return NodeFilter.FILTER_ACCEPT;\n        }\n      });\n      let node;\n      while ((node = walker.nextNode())) translateTextNode(node);\n      if (root.querySelectorAll) {\n        root.querySelectorAll('[placeholder],[aria-label],[aria-description],[title],[alt],input[value],button[value]').forEach(translateElementAttrs);\n      }\n    };\n    const run = () => walk(document.body || document.documentElement);\n    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });\n    else run();\n    [500, 1500, 3000, 5000, 10000, 15000, 30000].forEach(ms => setTimeout(run, ms));\n    const observer = new MutationObserver((mutations) => {\n      for (const mutation of mutations) {\n        if (mutation.type === 'characterData') translateTextNode(mutation.target);\n        for (const node of mutation.addedNodes || []) walk(node);\n        if (mutation.type === 'attributes') translateElementAttrs(mutation.target);\n      }\n    });\n    observer.observe(document.documentElement, {\n      subtree: true,\n      childList: true,\n      characterData: true,\n      attributes: true,\n      attributeFilter: ['placeholder', 'aria-label', 'aria-description', 'title', 'alt', 'value']\n    });\n  })();").catch(() => {});
    });
    void win.loadURL(url);
    return win;
}
/**
 * Focuses a window if it exists, or creates a new one.
 */
const showOrCreateWindow = (port) => {
    const wins = electron_1.BrowserWindow.getAllWindows();
    if (wins.length > 0) {
        wins[0].show();
        wins[0].focus();
    }
    else {
        createWindow(`${constants_1.WINDOW_ORIGIN}:${port}/`);
    }
};
exports.showOrCreateWindow = showOrCreateWindow;
/**
 * Manages the power save blocker to keep the computer awake.
 */
class SleepBlocker {
    constructor() {
        this.currentBlockerId = null;
    }
    static getInstance() {
        if (!SleepBlocker.instance) {
            SleepBlocker.instance = new SleepBlocker();
        }
        return SleepBlocker.instance;
    }
    shouldKeepComputerAwake(keep) {
        if (keep) {
            if (this.currentBlockerId === null) {
                this.currentBlockerId = electron_1.powerSaveBlocker.start('prevent-display-sleep');
                console.log('Power save blocker started:', this.currentBlockerId);
            }
        }
        else {
            if (this.currentBlockerId !== null) {
                electron_1.powerSaveBlocker.stop(this.currentBlockerId);
                console.log('Power save blocker stopped:', this.currentBlockerId);
                this.currentBlockerId = null;
            }
        }
    }
}
exports.SleepBlocker = SleepBlocker;
function getNodeWrapperPaths(envPath, os, isPackaged, userDataPath, baseDir) {
    const delimiter = os === 'win32' ? ';' : ':';
    if (!isPackaged) {
        const devBinPath = path_1.default.join(baseDir, '..', 'node_modules', '.bin');
        return {
            newEnvPath: `${devBinPath}${delimiter}${envPath || ''}`,
            nodeWrapperPath: undefined,
            binPath: undefined,
        };
    }
    const binPath = path_1.default.join(userDataPath, 'bin');
    const nodeWrapperPath = path_1.default.join(binPath, os === 'win32' ? 'agy-node.cmd' : 'agy-node');
    return {
        newEnvPath: `${binPath}${delimiter}${envPath || ''}`,
        nodeWrapperPath,
        binPath,
    };
}
/**
 * Sets up a wrapper script for Node.js that runs Electron as Node.
 * This allows running standard Node scripts using the Electron binary.
 */
function setupNodeWrapper(env) {
    const userDataPath = electron_1.app.isPackaged ? electron_1.app.getPath('userData') : '';
    // Windows environment variables are case-insensitive, but when copying process.env
    // into a plain object, we might get 'Path' instead of 'PATH'. We need to find
    // the actual key used to avoid creating case-duplicate keys (e.g. 'Path' and 'PATH')
    // which can confuse child_process.spawn on Windows.
    const isWindows = process.platform === 'win32';
    const pathKey = isWindows
        ? Object.keys(env).find((k) => k.toUpperCase() === 'PATH') || 'PATH'
        : 'PATH';
    const { newEnvPath, nodeWrapperPath, binPath } = getNodeWrapperPaths(env[pathKey], process.platform, electron_1.app.isPackaged, userDataPath, __dirname);
    env[pathKey] = newEnvPath;
    // In non-packaged dev mode, we don't create a wrapper and it'll just use machine node
    if (!nodeWrapperPath || !binPath) {
        return;
    }
    if (!fs.existsSync(binPath)) {
        fs.mkdirSync(binPath, { recursive: true });
    }
    let nodeWrapperContent = '';
    switch (process.platform) {
        case 'win32':
            nodeWrapperContent = `@echo off\nset ELECTRON_RUN_AS_NODE=1\n"${process.execPath}" %*\n`;
            break;
        case 'darwin': {
            // Use the Helper app instead of the main executable to prevent macOS
            // from bouncing a new Dock icon when this script is executed. The Helper
            // has LSUIElement=true in its Info.plist, running it invisibly.
            const appName = path_1.default.basename(process.execPath);
            let electronBinary = process.execPath;
            const helperPath = path_1.default.join(path_1.default.dirname(process.execPath), '..', 'Frameworks', `${appName} Helper.app`, 'Contents', 'MacOS', `${appName} Helper`);
            if (fs.existsSync(helperPath)) {
                electronBinary = helperPath;
            }
            nodeWrapperContent = `#!/bin/sh\nELECTRON_RUN_AS_NODE=1 exec "${electronBinary}" "$@"\n`;
            break;
        }
        default: // linux, etc.
            nodeWrapperContent = `#!/bin/sh\nELECTRON_RUN_AS_NODE=1 exec "${process.execPath}" "$@"\n`;
            break;
    }
    try {
        const existingContent = fs.existsSync(nodeWrapperPath)
            ? fs.readFileSync(nodeWrapperPath, 'utf-8')
            : '';
        if (existingContent !== nodeWrapperContent) {
            fs.writeFileSync(nodeWrapperPath, nodeWrapperContent);
            if (process.platform !== 'win32') {
                fs.chmodSync(nodeWrapperPath, 0o755);
            }
        }
    }
    catch (err) {
        console.error(`Failed to create node wrapper: ${err}`);
    }
}
