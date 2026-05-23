import fs from 'fs';
import path from 'path';

const translationsPath = 'translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const newPairs = [
  // MCP Store UI
  {
    "old": "R(\"div\",{className:\"text-lg font-medium\",children:\"MCP Store\"})",
    "new": "R(\"div\",{className:\"text-lg font-medium\",children:\"MCP 商店\"})"
  },
  {
    "old": "children:\"Manage MCP Servers\"",
    "new": "children:\"管理 MCP 服务端\""
  },
  {
    "old": "placeholder:\"Search MCP servers\"",
    "new": "placeholder:\"搜索 MCP 服务端\""
  },
  {
    "old": "children:\"Loading MCP servers\"",
    "new": "children:\"正在加载 MCP 服务端\""
  },
  {
    "old": "children:\"No servers found.\"",
    "new": "children:\"未找到服务端。\""
  },
  {
    "old": "children:t.length>0?`No search results found for \"${t}\".`:\"No servers found.\"",
    "new": "children:t.length>0?`未找到关于 \"${t}\" 的搜索结果。`:\"未找到任何服务端。\""
  },
  {
    "old": "children:\"This plugin has been built by the official publisher.\"",
    "new": "children:\"此插件由官方发布者构建。\""
  },
  {
    "old": "children:\"This plugin has been built by a verified reference publisher.\"",
    "new": "children:\"此插件由经验证的参考发布者构建。\""
  },
  {
    "old": "children:\"Failed to enable server, click to see details.\"",
    "new": "children:\"启用服务端失败，点击查看详情。\""
  },
  {
    "old": "children:\"Install\"",
    "new": "children:\"安装\""
  },
  {
    "old": "children:\"Installed\"",
    "new": "children:\"已安装\""
  },
  {
    "old": "children:\"MCP Servers Disabled\"",
    "new": "children:\"MCP 服务端已禁用\""
  },
  {
    "old": "children:\"Your administrator has disabled MCP servers.\"",
    "new": "children:\"您的管理员已禁用 MCP 服务端。\""
  },

  // MCP Manager Loading States & Actions
  {
    "old": "t.IDLE=\"Idle\",t.INSTALLING=\"Installing...\",t.ENABLING=\"Enabling...\",t.DISABLING=\"Disabling...\",t.UNINSTALLING=\"Uninstalling...\"",
    "new": "t.IDLE=\"空闲\",t.INSTALLING=\"正在安装...\",t.ENABLING=\"正在启用...\",t.DISABLING=\"正在禁用...\",t.UNINSTALLING=\"正在卸载...\""
  },
  {
    "old": "s.textContent=\"Enable\",o.textContent=\"Disable\",a.textContent=\"Uninstall\"",
    "new": "s.textContent=\"启用\",o.textContent=\"禁用\",a.textContent=\"卸载\""
  },
  {
    "old": "this._installButtonText.textContent=\"Enabled\"",
    "new": "this._installButtonText.textContent=\"已启用\""
  },
  {
    "old": "this._installButtonText.textContent=\"Disabled\"",
    "new": "this._installButtonText.textContent=\"已禁用\""
  },
  {
    "old": "this._installButtonText.textContent=\"Install\"",
    "new": "this._installButtonText.textContent=\"安装\""
  },
  {
    "old": "e.errorMessage||\"Failed to update server in config file\"",
    "new": "e.errorMessage||\"更新配置文件中的服务端失败\""
  },
  {
    "old": "S.errorMessage||\"Failed to update tool in config file\"",
    "new": "S.errorMessage||\"更新配置文件中的工具失败\""
  },

  // MCP Main Manager UI (No MCP servers installed state)
  {
    "old": "x.textContent=\"Loading MCP servers...\"",
    "new": "x.textContent=\"正在加载 MCP 服务端...\""
  },
  {
    "old": "v.textContent=\"Manage MCP servers\"",
    "new": "v.textContent=\"管理 MCP 服务端\""
  },
  {
    "old": "E.textContent=\"View raw config\"",
    "new": "E.textContent=\"查看原始配置\""
  },
  {
    "old": "u.textContent=\"No MCP servers installed. \",d.textContent=\"Click here\",h.textContent=\" to view the MCP server store.\",o.textContent=\"Configure\"",
    "new": "u.textContent=\"未安装任何 MCP 服务端。 \",d.textContent=\"点击此处\",h.textContent=\" 查看 MCP 服务端商店。\",o.textContent=\"配置\""
  },
  {
    "old": "F.textContent=\"Authenticate\"",
    "new": "F.textContent=\"进行身份验证\""
  },
  {
    "old": "k.errorMessage||\"Failed to update server in config file\"",
    "new": "k.errorMessage||\"更新配置文件中的服务端失败\""
  }
];

let addedCount = 0;
for (const pair of newPairs) {
  // Check if it already exists
  const exists = translations.some(t => t.old === pair.old);
  if (!exists) {
    translations.push(pair);
    addedCount++;
    console.log(`[ADD] Added translation for: ${pair.old.substring(0, 40)}...`);
  } else {
    console.log(`[SKIP] Already exists: ${pair.old.substring(0, 40)}...`);
  }
}

if (addedCount > 0) {
  fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
  console.log(`Successfully added ${addedCount} new translations to translations.json`);
} else {
  console.log('No new translations added.');
}
