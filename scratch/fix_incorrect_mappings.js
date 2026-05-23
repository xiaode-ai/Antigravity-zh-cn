import fs from 'fs';

const dictPath = 'translations.json';
let dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// Filter out the incorrect ones
dict = dict.filter(item => {
  return !item.old.startsWith("TAu={read_file:") && !item.old.startsWith("r7a={read_file:");
});

const correctedItems = [
  {
    "old": "TAu={read_file:\"read access to this path\",write_file:\"write access to this path\",read_url:\"reading this URL\",execute_url:\"executing actions on this URL\",command:\"running this command\",unsandboxed:\"running this command outside the sandbox\",mcp:\"using this MCP tool\"},kAu=(t,e)=>{let i=TAu[t]??\"access to this resource\";return e?`Save rule to always allow ${i}?`:`Allow ${i}?`};",
    "new": "TAu={read_file:\"读取此路径\",write_file:\"写入此路径\",read_url:\"读取此 URL\",execute_url:\"在此 URL 上执行操作\",command:\"运行此命令\",unsandboxed:\"在沙盒外运行此命令\",mcp:\"使用此 MCP 工具\"},kAu=(t,e)=>{let i=TAu[t]??\"访问此资源\";return e?`是否保存规则以始终允许${i}？`:`是否允许${i}？`};"
  },
  {
    "old": "r7a={read_file:\"read access to this path\",write_file:\"write access to this path\",read_url:\"reading this URL\",execute_url:\"executing actions on this URL\",command:\"running this command\",unsandboxed:\"running this command outside the sandbox\",mcp:\"using this MCP tool\"},n7a=(e,t)=>{let r=r7a[e]??\"access to this resource\";return t?`Save rule to always allow ${r}?`:`Allow ${r}?`},",
    "new": "r7a={read_file:\"读取此路径\",write_file:\"写入此路径\",read_url:\"读取此 URL\",execute_url:\"在此 URL 上执行操作\",command:\"运行此命令\",unsandboxed:\"在沙盒外运行此命令\",mcp:\"使用此 MCP 工具\"},n7a=(e,t)=>{let r=r7a[e]??\"访问此资源\";return t?`是否保存规则以始终允许${r}？`:`是否允许${r}？`},"
  }
];

correctedItems.forEach(item => {
  dict.push(item);
});

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log('Successfully corrected TAu and r7a mappings in translations.json!');
