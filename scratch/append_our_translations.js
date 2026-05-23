import fs from 'fs';

const dictPath = 'translations.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

const newItems = [
  {
    "old": "\"Compacting\"",
    "new": "\"正在压缩\""
  },
  {
    "old": "\"Search for files edited by Agent\"",
    "new": "\"搜索智能体修改过的文件\""
  },
  {
    "old": "let d=don(0),f=d?`Comment (${d})`:\"Comment\";",
    "new": "let d=don(0),f=d?`评论 (${d})`:\"评论\";"
  },
  {
    "old": "let u=xIo(0),d=u?`Comment (${u})`:\"Comment\";",
    "new": "let u=xIo(0),d=u?`评论 (${u})`:\"评论\";"
  },
  {
    "old": "children:a===i-1?\"Submit (Enter)\":\"Continue (Enter)\"",
    "new": "children:a===i-1?\"提交 (Enter)\":\"继续 (Enter)\""
  },
  {
    "old": "children:r===s-1?\"Submit (Enter)\":\"Continue (Enter)\"",
    "new": "children:r===s-1?\"提交 (Enter)\":\"继续 (Enter)\""
  },
  {
    "old": "children:`Skip (esc), Skip All (${Fte?\"\\u2318esc\":\"Ctrl+esc\"})`",
    "new": "children:`跳过 (esc)，全部跳过 (${Fte?\"\\u2318esc\":\"Ctrl+esc\"})`"
  },
  {
    "old": "children:`Skip (esc), Skip All (${Ect?\"\\u2318esc\":\"Ctrl+esc\"})`",
    "new": "children:`跳过 (esc)，全部跳过 (${Ect?\"\\u2318esc\":\"Ctrl+esc\"})`"
  },
  {
    "old": "children:`Skip (esc), Skip All (${BK?\"\\u2318esc\":\"Ctrl+esc\"})`",
    "new": "children:`跳过 (esc)，全部跳过 (${BK?\"\\u2318esc\":\"Ctrl+esc\"})`"
  },
  {
    "old": "fZi={read_file:\"read access to this path\",write_file:\"write access to this path\",read_url:\"reading this URL\",execute_url:\"executing actions on this URL\",command:\"running this command\",unsandboxed:\"running this command outside the sandbox\",mcp:\"using this MCP tool\"},gZi=(e,t)=>{let r=fZi[e]??\"access to this resource\";return t?`Save rule to always allow ${r}?`:`Allow ${r}?`};",
    "new": "fZi={read_file:\"读取此路径\",write_file:\"写入此路径\",read_url:\"读取此 URL\",execute_url:\"在此 URL 上执行操作\",command:\"运行此命令\",unsandboxed:\"在沙盒外运行此命令\",mcp:\"使用此 MCP 工具\"},gZi=(e,t)=>{let r=fZi[e]??\"访问此资源\";return t?`是否保存规则以始终允许${r}？`:`是否允许${r}？`};"
  },
  {
    "old": "TAu={read_file:\"read access to this path\",write_file:\"write access to this path\",read_url:\"reading this URL\",execute_url:\"executing actions on this URL\",command:\"running this command\",unsandboxed:\"running this command outside the sandbox\",mcp:\"using this MCP tool\"},LAu=(t,e)=>{let i=TAu[t]??\"access to this resource\";return e?`Save rule to always allow ${i}?`:`Allow ${i}?`};",
    "new": "TAu={read_file:\"读取此路径\",write_file:\"写入此路径\",read_url:\"读取此 URL\",execute_url:\"在此 URL 上执行操作\",command:\"运行此命令\",unsandboxed:\"在沙盒外运行此命令\",mcp:\"使用此 MCP 工具\"},LAu=(t,e)=>{let i=TAu[t]??\"访问此资源\";return e?`是否保存规则以始终允许${i}？`:`是否允许${i}？`};"
  },
  {
    "old": "r7a={read_file:\"read access to this path\",write_file:\"write access to this path\",read_url:\"reading this URL\",execute_url:\"executing actions on this URL\",command:\"running this command\",unsandboxed:\"running this command outside the sandbox\",mcp:\"using this MCP tool\"},a7a=(e,t)=>{let r=r7a[e]??\"access to this resource\";return t?`Save rule to always allow ${r}?`:`Allow ${r}?`};",
    "new": "r7a={read_file:\"读取此路径\",write_file:\"写入此路径\",read_url:\"读取此 URL\",execute_url:\"在此 URL 上执行操作\",command:\"运行此命令\",unsandboxed:\"在沙盒外运行此命令\",mcp:\"使用此 MCP 工具\"},a7a=(e,t)=>{let r=r7a[e]??\"访问此资源\";return t?`是否保存规则以始终允许${r}？`:`是否允许${r}？`};"
  },
  {
    "old": "if(y||fe(\"Yes, allow this time\",s1.ONCE),!x){if(d?.projectSettingsProvider&&b){let Se=b===NC,Ye=y?D&&I?`Yes, save rule for '${I}' ${Se?\"when not in a project\":\"in this project\"}`:`Yes, save rule ${Se?\"when not in a project\":\"in this project\"}`:D&&I?`Yes, and always allow '${I}' ${Se?\"when not in a project\":\"in this project\"}`:`Yes, and always allow ${Se?\"when not in a project\":\"in this project\"}`;fe(Ye,s1.PROJECT)}if(u){let Se=y?D&&I?`Yes, save rule for '${I}' in this workspace`:\"Yes, save rule in this workspace\":D&&I?`Yes, and always allow '${I}' in this workspace`:\"Yes, and always allow in this workspace\";fe(Se,s1.WORKSPACE)}if(g!==\"Cider\"){let Se=y?D&&I?`Yes, save rule for '${I}' globally`:\"Yes, save rule globally\":D&&I?`Yes, and always allow '${I}'`:\"Yes, and always allow\";fe(Se,s1.GLOBAL)}}",
    "new": "if(y||fe(\"是，允许本次\",s1.ONCE),!x){if(d?.projectSettingsProvider&&b){let Se=b===NC,Ye=y?D&&I?`是，${Se?\"非项目中\":\"在此项目中\"}保存 '${I}' 的规则`:`是，${Se?\"非项目中\":\"在此项目中\"}保存规则`:D&&I?`是，${Se?\"非项目中\":\"在此项目中\"}始终允许 '${I}'`:`是，${Se?\"非项目中\":\"在此项目中\"}始终允许`;fe(Ye,s1.PROJECT)}if(u){let Se=y?D&&I?`是，在此工作区中保存 '${I}' 的规则`:\"是，在此工作区中保存规则\":D&&I?`是，在此工作区中始终允许 '${I}'`:\"是，在此工作区中始终允许\";fe(Se,s1.WORKSPACE)}if(g!==\"Cider\"){let Se=y?D&&I?`是，全局保存 '${I}' 的规则`:\"是，全局保存规则\":D&&I?`是，始终允许 '${I}'`:\"是，始终允许\";fe(Se,s1.GLOBAL)}}"
  },
  {
    "old": "if(g||Ce(\"Yes, allow this time\",nI.ONCE),!x){if(u?.projectSettingsProvider&&f){let We=f===jBe,rt=g?F&&A?`Yes, save rule for '${A}' ${We?\"when not in a project\":\"in this project\"}`:`Yes, save rule ${We?\"when not in a project\":\"in this project\"}`:F&&A?`Yes, and always allow '${A}' ${We?\"when not in a project\":\"in this project\"}`:`Yes, and always allow ${We?\"when not in a project\":\"in this project\"}`;Ce(rt,nI.PROJECT)}if(l){let We=g?F&&A?`Yes, save rule for '${A}' in this workspace`:\"Yes, save rule in this workspace\":F&&A?`Yes, and always allow '${A}' in this workspace`:\"Yes, and always allow in this workspace\";Ce(We,nI.WORKSPACE)}if(h!==\"Cider\"){let We=g?F&&A?`Yes, save rule for '${A}' globally`:\"Yes, save rule globally\":F&&A?`Yes, and always allow '${A}'`:\"Yes, and always allow\";Ce(We,nI.GLOBAL)}}",
    "new": "if(g||Ce(\"是，允许本次\",nI.ONCE),!x){if(u?.projectSettingsProvider&&f){let We=f===jBe,rt=g?F&&A?`是，${We?\"非项目中\":\"在此项目中\"}保存 '${A}' 的规则`:`是，${We?\"非项目中\":\"在此项目中\"}保存规则`:F&&A?`是，${We?\"非项目中\":\"在此项目中\"}始终允许 '${A}'`:`是，${We?\"非项目中\":\"在此项目中\"}始终允许`;Ce(rt,nI.PROJECT)}if(l){let We=g?F&&A?`是，在此工作区中保存 '${A}' 的规则`:\"是，在此工作区中保存规则\":F&&A?`是，在此工作区中始终允许 '${A}'`:\"是，在此工作区中始终允许\";Ce(We,nI.WORKSPACE)}if(h!==\"Cider\"){let We=g?F&&A?`是，全局保存 '${A}' 的规则`:\"是，全局保存规则\":F&&A?`是，始终允许 '${A}'`:\"是，始终允许\";Ce(We,nI.GLOBAL)}}"
  },
  {
    "old": "if(R||me(\"Yes, allow this time\",lp.ONCE),!w){if(d?.projectSettingsProvider&&E){let xe=E===XG,Ye=R?D&&x?`Yes, save rule for '${x}' ${xe?\"when not in a project\":\"in this project\"}`:`Yes, save rule ${xe?\"when not in a project\":\"in this project\"}`:D&&x?`Yes, and always allow '${x}' ${xe?\"when not in a project\":\"in this project\"}`:`Yes, and always allow ${xe?\"when not in a project\":\"in this project\"}`;me(Ye,lp.PROJECT)}if(u){let xe=R?D&&x?`Yes, save rule for '${x}' in this workspace`:\"Yes, save rule in this workspace\":D&&x?`Yes, and always allow '${x}' in this workspace`:\"Yes, and always allow in this workspace\";me(xe,lp.WORKSPACE)}if(p!==\"Cider\"){let xe=R?D&&x?`Yes, save rule for '${x}' globally`:\"Yes, save rule globally\":D&&x?`Yes, and always allow '${x}'`:\"Yes, and always allow\";me(xe,lp.GLOBAL)}}",
    "new": "if(R||me(\"是，允许本次\",lp.ONCE),!w){if(d?.projectSettingsProvider&&E){let xe=E===XG,Ye=R?D&&x?`是，${xe?\"非项目中\":\"在此项目中\"}保存 '${x}' 的规则`:`是，${xe?\"非项目中\":\"在此项目中\"}保存规则`:D&&x?`是，${xe?\"非项目中\":\"在此项目中\"}始终允许 '${x}'`:`是，${xe?\"非项目中\":\"在此项目中\"}始终允许`;me(Ye,lp.PROJECT)}if(u){let xe=R?D&&x?`是，在此工作区中保存 '${x}' 的规则`:\"是，在此工作区中保存规则\":D&&x?`是，在此工作区中始终允许 '${x}'`:\"是，在此工作区中始终允许\";me(xe,lp.WORKSPACE)}if(p!==\"Cider\"){let xe=R?D&&x?`是，全局保存 '${x}' 的规则`:\"是，全局保存规则\":D&&x?`是，始终允许 '${x}'`:\"是，始终允许\";me(xe,lp.GLOBAL)}}"
  },
  {
    "old": "writeInLabel:\"No\",writeInPlaceholder:\"(tell the agent what to do instead)\"",
    "new": "writeInLabel:\"否\",writeInPlaceholder:\"(告诉智能体应该怎么做)\""
  }
];

// Append them if they don't already exist
newItems.forEach(item => {
  const exists = dict.some(d => d.old === item.old);
  if (!exists) {
    dict.push(item);
  }
});

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('Successfully appended new translation items to translations.json');
