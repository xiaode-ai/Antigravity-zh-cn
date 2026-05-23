import fs from 'fs';

const translationsPath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Initial translations count: ${translations.length}`);

const targetMappings = [
  {
    "old": "All Edited Files Reviewed",
    "new": "所有已修改文件已审核"
  },
  {
    "old": "label:\"Auto-Open Edited Files\"",
    "new": "label:\"自动打开已修改文件\""
  },
  {
    "old": "description:\"Open files in the background if Agent creates or edits them\"",
    "new": "description:\"智能体创建或修改文件时，在后台自动打开它们\""
  },
  {
    "old": "description:[\"Open files in the background if the agent creates or edits them\"]",
    "new": "description:[\"智能体创建或修改文件时，在后台自动打开它们\"]"
  },
  {
    "old": "prefixOverride:za(t)?\"Semantic searching\":\"Semantic searched\"",
    "new": "prefixOverride:za(t)?\"正在进行语义搜索\":\"语义已搜索\""
  },
  {
    "old": "prefixOverride:ui(t)?\"Semantic searching\":\"Semantic searched\"",
    "new": "prefixOverride:ui(t)?\"正在进行语义搜索\":\"语义已搜索\""
  },
  {
    "old": "prefixOverride:ll(e)?\"Semantic searching\":\"Semantic searched\"",
    "new": "prefixOverride:ll(e)?\"正在进行语义搜索\":\"语义已搜索\""
  },
  {
    "old": "children:n||(ui(e)?\"Searching\":\"Searched\")",
    "new": "children:n||(ui(e)?\"正在搜索\":\"已搜索\")"
  },
  {
    "old": "prefix:E?\"Searching Moma for\":\"Searched Moma for\"",
    "new": "prefix:E?\"正在 Moma 中搜索\":\"已在 Moma 中搜索\""
  },
  {
    "old": "case\"mcpTool\":return\"Error while running MCP tool\";case\"errorMessage\":return\"Error\";default:return\"Error during tool execution\"",
    "new": "case\"mcpTool\":return\"运行 MCP 工具时出错\";case\"errorMessage\":return\"错误\";default:return\"执行工具时出错\""
  }
];

// Append targets
for (const mapping of targetMappings) {
  // Prevent duplicate additions
  if (!translations.some(t => t.old === mapping.old)) {
    translations.push(mapping);
    console.log(`Added mapping for old: "${mapping.old.substring(0, 40)}${mapping.old.length > 40 ? '...' : ''}"`);
  } else {
    console.log(`Skipped existing mapping for: "${mapping.old.substring(0, 40)}${mapping.old.length > 40 ? '...' : ''}"`);
  }
}

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log(`Saved translations. Total count now: ${translations.length}`);
