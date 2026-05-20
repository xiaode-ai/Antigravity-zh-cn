import fs from 'fs';

const targetPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js';
const content = fs.readFileSync(targetPath, 'utf8');

console.log('=== 检查编译后 main.js 中所有下拉菜单描述小字的翻译现状 ===\n');

// 1. 终端命令自动执行的描述
const terminalDescs = [
  { label: '终端-始终执行(EAGER)', text: 'Agent never asks for confirmation before executing terminal commands' },
  { label: '终端-始终执行(EAGER)中文', text: '智能体在执行终端命令前从不请求确认' },
  { label: '终端-需要审核(OFF)', text: 'Agent always asks for confirmation before executing terminal commands' },
  { label: '终端-需要审核(OFF)中文', text: '智能体在执行终端命令前总是请求确认' },
  { label: '终端-沙箱执行(默认)', text: 'Terminal command automatically proceeds if the command runs inside the sandbox' },
  { label: '终端-沙箱执行(默认)中文', text: '如果在沙箱内运行，终端命令会自动执行' },
];

// 2. 产物审核的描述
const artifactDescs = [
  { label: '产物-始终执行(TURBO)', text: 'Agent never asks for review. This maximizes the autonomy' },
  { label: '产物-始终执行(TURBO)中文', text: '智能体从不请求审核。这最大化了智能体的自主性' },
  { label: '产物-每次询问(ALWAYS)', text: 'Agent always asks for review.' },
  { label: '产物-每次询问(ALWAYS)中文', text: '智能体总是请求审核。' },
];

// 3. 浏览器JS执行的描述
const browserDescs = [
  { label: '浏览器-禁用', text: 'Block all browser JavaScript execution.' },
  { label: '浏览器-禁用中文', text: '阻止所有浏览器 JavaScript 执行。' },
  { label: '浏览器-需要审核', text: 'Prompt for approval before running browser scripts.' },
  { label: '浏览器-需要审核中文', text: '在运行浏览器脚本前提示审核。' },
  { label: '浏览器-始终执行', text: 'Allow full browser script execution without prompting.' },
  { label: '浏览器-始终执行中文', text: '允许完全执行浏览器脚本而无需提示。' },
];

// 4. 安全预设的描述
const presetDescs = [
  { label: '安全预设-自定义', text: 'Manually customize individual settings.' },
  { label: '安全预设-自定义中文', text: '手动自定义各项设置。' },
];

// 5. Agent Settings 区域的 label 和 description
const settingLabels = [
  { label: 'Security Preset标签', text: 'label:"Security Preset"' },
  { label: 'Security Preset标签中文', text: 'label:"安全预设"' },
  { label: 'Outside of folders标签', text: 'label:"Outside of folders file access policy"' },
  { label: '文件夹外标签中文', text: 'label:"智能体非工作区文件访问"' },
  { label: 'Terminal Command标签', text: 'label:"Terminal Command Auto Execution"' },
  { label: '终端命令标签中文', text: 'label:"终端命令自动执行"' },
  { label: 'Enable Sandbox标签', text: 'label:"Enable Sandbox Mode (Preview)"' },
  { label: '沙箱标签中文', text: 'label:"启用沙箱模式 (预览)"' },
];

// 6. displayResolver 中的显示文本
const displayResolverTexts = [
  { label: 'Always Proceed显示', text: '"Always Proceed"' },
  { label: '始终执行显示', text: '"始终执行"' },
  { label: 'Proceed in Sandbox显示', text: '"Proceed in Sandbox"' },
  { label: '在沙箱中执行显示', text: '"在沙箱中执行"' },
  { label: 'Require Review显示', text: '"Require Review"' },
  { label: '需要审核显示', text: '"需要审核"' },
  { label: 'Request Review显示', text: '"Request Review"' },
  { label: 'Always Ask显示', text: '"Always Ask"' },
  { label: '每次询问显示', text: '"每次询问"' },
];

const allChecks = [...terminalDescs, ...artifactDescs, ...browserDescs, ...presetDescs, ...settingLabels, ...displayResolverTexts];

for (const item of allChecks) {
  const found = content.includes(item.text);
  const status = found ? '✅ 存在' : '❌ 不存在';
  console.log(`${status}  ${item.label}: "${item.text.substring(0, 60)}..."`);
}

// 额外：检查 qne 组件 trigger 中 capitalize 的上下文
console.log('\n=== qne Trigger capitalize 上下文 ===');
let idx = content.indexOf('className:"capitalize"');
if (idx !== -1) {
  console.log(content.substring(idx - 50, idx + 100));
}
