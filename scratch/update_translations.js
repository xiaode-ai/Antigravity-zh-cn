import fs from 'fs';
import path from 'path';

const translationsPath = './translations.json';

const newTranslations = [
  // 1. Files Changed templates
  {
    "old": "children:`${y} ${y===1?\"file\":\"files\"} changed`",
    "new": "children:`${y} 个文件已更改`"
  },
  {
    "old": "children:`${g} ${g===1?\"file\":\"files\"} changed`",
    "new": "children:`${g} 个文件已更改`"
  },
  {
    "old": "children:`${R} ${R===1?\"file\":\"files\"} changed`",
    "new": "children:`${R} 个文件已更改`"
  },
  // 2. Listed directory templates
  {
    "old": "listDirectory:e=>`Listed directory ${Pft(e.directoryPathUri)}`",
    "new": "listDirectory:e=>`已列出目录 ${Pft(e.directoryPathUri)}`"
  },
  {
    "old": "listDirectory:t=>`Listed directory ${m0n(t.directoryPathUri)}`",
    "new": "listDirectory:t=>`已列出目录 ${m0n(t.directoryPathUri)}`"
  },
  {
    "old": "listDirectory:e=>`Listed directory ${K_t(e.directoryPathUri)}`",
    "new": "listDirectory:e=>`已列出目录 ${K_t(e.directoryPathUri)}`"
  },
  // 3. Export / Export Artifact dialogs & tooltips
  {
    "old": "dialogTitle:a=\"Export\"",
    "new": "dialogTitle:a=\"导出\""
  },
  {
    "old": "dialogTitle:r=\"Export\"",
    "new": "dialogTitle:r=\"导出\""
  },
  {
    "old": "label:\"Export\",onClick:",
    "new": "label:\"导出\",onClick:"
  },
  {
    "old": "title:\"Export Artifact\",saveLabel:\"Export\"",
    "new": "title:\"导出产物\",saveLabel:\"导出\""
  },
  {
    "old": "dialogTitle:\"Export Artifact\"",
    "new": "dialogTitle:\"导出产物\""
  },
  {
    "old": "tooltip:d?\"Saved!\":\"Export Artifact\"",
    "new": "tooltip:d?\"已保存!\":\"导出产物\""
  },
  {
    "old": "tooltip:u?\"Saved!\":\"Export Artifact\"",
    "new": "tooltip:u?\"已保存!\":\"导出产物\""
  },
  // 4. extension.js QuickPick options
  {
    "old": "placeHolder:\"Select where to open the conversation\"",
    "new": "placeHolder:\"选择打开对话的位置\""
  },
  {
    "old": "label:\"Open in current window\"",
    "new": "label:\"在当前窗口中打开\""
  },
  {
    "old": "description:\"Continue conversation in the current workspace\"",
    "new": "description:\"在当前工作区中继续对话\""
  },
  {
    "old": "label:\"Open in workspace: \"",
    "new": "label:\"在工作区中打开：\""
  },
  // 5. Background task run status
  {
    "old": "s+=`\\`\\${e}\\` task `;",
    "new": "s+=`任务 \\`\\${e}\\` `;"
  },
  {
    "old": "s+=n.every(l=>l.state===Sv.Idle)?a?`finished with \\`\\${a}\\` problem\\${a===1?\"\":\"s\"}`:\"finished\":a?`started and will continue to run in the background with \\`\\${a}\\` problem\\${a===1?\"\":\"s\"}`:\"started and will continue to run in the background\"",
    "new": "s+=n.every(l=>l.state===Sv.Idle)?a?`运行完成，但发现 \\`\\${a}\\` 个问题`:\"已完成\":a?`已启动并将继续在后台运行，目前有 \\`\\${a}\\` 个问题`:\"已启动并将继续在后台运行\""
  },
  {
    "old": "if(r)return o?new Fi(`Got output for \\${s} with \\`\\${o}\\` problem\\${o===1?\"\":\"s\"}`):new Fi(`Got output for \\${s}`);",
    "new": "if(r)return o?new Fi(`已获取到 \\${s} 的输出，发现 \\`\\${o}\\` 个问题`):new Fi(`已获取到 \\${s} 的输出`);"
  }
];

if (fs.existsSync(translationsPath)) {
  const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  console.log(`Original translations count: ${translations.length}`);
  
  // Prevent duplicate additions
  let addedCount = 0;
  for (const item of newTranslations) {
    if (!translations.some(t => t.old === item.old)) {
      translations.push(item);
      addedCount++;
    }
  }
  
  fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
  console.log(`Appended ${addedCount} new translation entries. New total: ${translations.length}`);
} else {
  console.error('translations.json not found!');
}
