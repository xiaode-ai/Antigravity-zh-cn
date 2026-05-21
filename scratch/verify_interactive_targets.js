import fs from 'fs';

const mainPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainPath, 'utf8');

const newTranslations = [
  {
    "old": "title:\"Subagents\"",
    "new": "title:\"子智能体\""
  },
  {
    "old": "{icon:\"stop_circle\",tooltip:\"Stop All Subagents\",onClick:()=>{b({conversationId:a})}}",
    "new": "{icon:\"stop_circle\",tooltip:\"停止所有子智能体\",onClick:()=>{b({conversationId:a})}}"
  },
  {
    "old": "p(\"button\",{onClick:X=>{i(ds.STEP_ACCEPT,\"subagent_approve_button\"),k(X)},className:\"text-xs cursor-pointer rounded px-1.5 py-px bg-primary text-primary-foreground hover:opacity-90 transition-opacity\",children:\"Approve\"}),p(\"button\",{onClick:X=>{i(ds.STEP_REJECT,\"subagent_deny_button\"),G(X)},className:\"text-xs cursor-pointer rounded px-1.5 py-px bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity\",children:\"Deny\"})",
    "new": "p(\"button\",{onClick:X=>{i(ds.STEP_ACCEPT,\"subagent_approve_button\"),k(X)},className:\"text-xs cursor-pointer rounded px-1.5 py-px bg-primary text-primary-foreground hover:opacity-90 transition-opacity\",children:\"批准\"}),p(\"button\",{onClick:X=>{i(ds.STEP_REJECT,\"subagent_deny_button\"),G(X)},className:\"text-xs cursor-pointer rounded px-1.5 py-px bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity\",children:\"拒绝\"})"
  },
  {
    "old": "children:\"Blocked, needs input\"",
    "new": "children:\"已受阻，需要输入\""
  },
  {
    "old": "children:V.waitingStepSummary||\"Needs attention\"",
    "new": "children:V.waitingStepSummary||\"需要关注\""
  },
  {
    "old": "n1t=({promptText:e,handleUserInteraction:t})=>{let{inputBoxRef:r}=jn();return p(\"div\",{className:\"text-sm flex w-full items-center justify-between flex-wrap\",children:[p(\"p\",{children:e}),p(\"div\",{className:\"flex gap-2 ml-auto\",children:[p(lo,{onClick:()=>{t(!1)},children:\"Reject\"}),p(Eo,{onClick:()=>{t(!0)},children:\"Accept\"})]})]})}",
    "new": "n1t=({promptText:e,handleUserInteraction:t})=>{let{inputBoxRef:r}=jn();return p(\"div\",{className:\"text-sm flex w-full items-center justify-between flex-wrap\",children:[p(\"p\",{children:e}),p(\"div\",{className:\"flex gap-2 ml-auto\",children:[p(lo,{onClick:()=>{t(!1)},children:\"拒绝\"}),p(Eo,{onClick:()=>{t(!0)},children:\"接受\"})]})]})}"
  },
  {
    "old": "X=U?p(n1t,{promptText:\"Approve?\",handleUserInteraction:G}):null",
    "new": "X=U?p(n1t,{promptText:\"批准？\",handleUserInteraction:G}):null"
  },
  {
    "old": "p(n1t,{promptText:\"Send command input?\",handleUserInteraction:s=>{i?.(e,t,r,{case:\"sendCommandInput\",value:At(uei,{confirm:s})}",
    "new": "p(n1t,{promptText:\"发送终端输入？\",handleUserInteraction:s=>{i?.(e,t,r,{case:\"sendCommandInput\",value:At(uei,{confirm:s})}"
  },
  {
    "old": "children:[p(\"span\",{className:\"text-secondary-foreground\",children:\"Read URL content?\"}),p(\"div\",{className:\"flex gap-2 ml-auto\",children:[p(lo,{onClick:()=>{n(!1)},children:\"Reject\"}),p(Eo,{onClick:()=>{n(!0)},children:\"Accept\"})]})]",
    "new": "children:[p(\"span\",{className:\"text-secondary-foreground\",children:\"读取 URL 内容？\"}),p(\"div\",{className:\"flex gap-2 ml-auto\",children:[p(lo,{onClick:()=>{n(!1)},children:\"拒绝\"}),p(Eo,{onClick:()=>{n(!0)},children:\"接受\"})]})]"
  },
  {
    "old": "return e.userRejected?p(\"span\",{className:\"text-secondary-foreground truncate\",children:\"Read URL rejected\"}):null",
    "new": "return e.userRejected?p(\"span\",{className:\"text-secondary-foreground truncate\",children:\"读取 URL 被拒绝\"}):null"
  },
  {
    "old": "children:[k===Of.KILL&&p(ef,{size:12,className:\"flex-shrink-0\"}),\"Reject All\"]}),p(_n,{id:O,delayShow:300,place:\"bottom\",children:\"Reject all generated responses and revert to the state before triggering battle mode.\"})",
    "new": "children:[k===Of.KILL&&p(ef,{size:12,className:\"flex-shrink-0\"}),\"全部拒绝\"]}),p(_n,{id:O,delayShow:300,place:\"bottom\",children:\"拒绝所有生成的响应，并恢复到触发对决模式之前的状态。\"})"
  },
  {
    "old": "function lFi(e,t){return Ve(()=>[{value:rl.OFF,label:\"Ask every time\",isAllowed:t},{value:rl.EAGER,label:\"Always run\",isAllowed:t&&!e,disabledReason:t?\"Disabled in strict mode\":\"Requires limited-internet host.\"}],[e,t])}",
    "new": "function lFi(e,t){return Ve(()=>[{value:rl.OFF,label:\"每次询问\",isAllowed:t},{value:rl.EAGER,label:\"始终运行\",isAllowed:t&&!e,disabledReason:t?\"在严格模式下禁用\":\"需要受限网络主机。\"}],[e,t])}"
  },
  {
    "old": "function t9i(e){return Ve(()=>[{value:vh.DISABLED,label:\"Disabled\",isAllowed:!0},{value:vh.ALWAYS_ASK,label:\"Ask first\",isAllowed:!e,disabledReason:\"JavaScript execution disabled in strict mode\"},{value:vh.TURBO,label:\"Always run\",isAllowed:!e,disabledReason:\"JavaScript execution disabled in strict mode\"}],[e])}",
    "new": "function t9i(e){return Ve(()=>[{value:vh.DISABLED,label:\"已禁用\",isAllowed:!0},{value:vh.ALWAYS_ASK,label:\"先询问\",isAllowed:!e,disabledReason:\"严格模式下已禁用 JavaScript 执行\"},{value:vh.TURBO,label:\"始终运行\",isAllowed:!e,disabledReason:\"严格模式下已禁用 JavaScript 执行\"}],[e])}"
  },
  {
    "old": "d=Ve(()=>({label:\"Always Allow\",onClick:()=>e()}),[e]),f=Ve(()=>({label:\"Deny\",onClick:()=>t()}),[t]),g=Ve(()=>({label:\"Allow Once\",onClick:()=>r()}),[r])",
    "new": "d=Ve(()=>({label:\"始终允许\",onClick:()=>e()}),[e]),f=Ve(()=>({label:\"拒绝\",onClick:()=>t()}),[t]),g=Ve(()=>({label:\"允许一次\",onClick:()=>r()}),[r])"
  },
  {
    "old": "V=Ve(()=>({label:\"Deny\",onClick:F}),[F]),I=Ve(()=>({label:\"Allow once\",onClick:y}),[y]),x=Ve(()=>{if(!a)return null;try{return new URL(a).hostname}catch{return a}},[a]),D=Ve(()=>({label:`Allow ${x}`,onClick:C,keybindingLabel:\"\"}),[C,x])",
    "new": "V=Ve(()=>({label:\"拒绝\",onClick:F}),[F]),I=Ve(()=>({label:\"允许一次\",onClick:y}),[y]),x=Ve(()=>{if(!a)return null;try{return new URL(a).hostname}catch{return a}},[a]),D=Ve(()=>({label:`允许 ${x}`,onClick:C,keybindingLabel:\"\"}),[C,x])"
  },
  {
    "old": "children:[p(lo,{onClick:F,className:qW,children:\"Deny\"}),p(Eo,{onClick:y,className:qW,children:[\"Allow\",o&&p(\"span\",{className:\"ml-0.5 text-muted-foreground\",children:o})]})]",
    "new": "children:[p(lo,{onClick:F,className:qW,children:\"拒绝\"}),p(Eo,{onClick:y,className:qW,children:[\"允许\",o&&p(\"span\",{className:\"ml-0.5 text-muted-foreground\",children:o})]})]"
  },
  {
    "old": "p(\"button\",{onClick:()=>{g(!1,s1.UNSPECIFIED)},className:\"px-2 py-1 cursor-pointer rounded-sm text-sm text-secondary-foreground transition-[opacity] hover:text-foreground\",children:\"Deny\"}),p(zon,{label:\"Allow in Conversation\",onClick:()=>g(!0,s1.CONVERSATION),subOptions:y,onSubOptionChange:F=>g(!0,F),header:\"Allow options\"})",
    "new": "p(\"button\",{onClick:()=>{g(!1,s1.UNSPECIFIED)},className:\"px-2 py-1 cursor-pointer rounded-sm text-sm text-secondary-foreground transition-[opacity] hover:text-foreground\",children:\"拒绝\"}),p(zon,{label:\"在对话中允许\",onClick:()=>g(!0,s1.CONVERSATION),subOptions:y,onSubOptionChange:F=>g(!0,F),header:\"允许选项\"})"
  },
  {
    "old": "function yFi(e,t){let r=e.terminate?\"termination request\":\"input\";return e.userRejected?`Rejected sending ${r} to command`:t===On.DONE?`Sent ${r} to command`:t===On.WAITING?`Suggested sending ${r} to command`:t===On.ERROR?`Error sending ${r} to command`:`Sending ${r} to command`}",
    "new": "function yFi(e,t){let r=e.terminate?\"终止请求\":\"输入\";return e.userRejected?`已拒绝向命令发送${r}`:t===On.DONE?`已向命令发送${r}`:t===On.WAITING?`建议向命令发送${r}`:t===On.ERROR?`向命令发送${r}时出错`:`正在向命令发送${r}`}"
  },
  {
    "old": "children:[n.isAccept?\"Accepted\":\"Rejected\",\" all changes to the below files\"]",
    "new": "children:[n.isAccept?\"已接受\":\"已拒绝\",\" 对以下文件的所有更改\"]"
  },
  {
    "old": "children:[p(\"span\",{children:[n.isAccept?\"Accepted\":\"Rejected\",\" \",i]}),\" \",p(uR,{fileUri:s.uriPath",
    "new": "children:[p(\"span\",{children:[n.isAccept?\"已接受\":\"已拒绝\",\" \",i]}),\" \",p(uR,{fileUri:s.uriPath"
  },
  {
    "old": "PendingNewWorkspace,onClick:()=>{d.setPendingNewWorkspace(!0),r(!1)},icon:p(qe,{name:\"auto_awesome\",size:12}),children:\"New Workspace\"",
    "new": "PendingNewWorkspace,onClick:()=>{d.setPendingNewWorkspace(!0),r(!1)},icon:p(qe,{name:\"auto_awesome\",size:12}),children:\"新建工作区\""
  },
  {
    "old": "N=d?p(\"span\",{style:{display:\"inline-flex\",alignItems:\"center\",gap:\"4px\"},children:[p(qe,{name:\"auto_awesome\",size:12}),\"New Workspace\"]}):u",
    "new": "N=d?p(\"span\",{style:{display:\"inline-flex\",alignItems:\"center\",gap:\"4px\"},children:[p(qe,{name:\"auto_awesome\",size:12}),\"新建工作区\"]}):u"
  },
  {
    "old": "return p(Hft,{title:i?\"New Workspace\":\"New Worktree\",icon:p(qe,{name:\"call_split\",size:14,className:\"mt-0.5\"}),subtitle:g,onClick:()=>{t(),r(!1)}})",
    "new": "return p(Hft,{title:i?\"新建工作区\":\"新建工作树\",icon:p(qe,{name:\"call_split\",size:14,className:\"mt-0.5\"}),subtitle:g,onClick:()=>{t(),r(!1)}})"
  },
  {
    "old": "p(\"p\",{className:\"text-xs opacity-50\",children:\"Pending messages\"})",
    "new": "p(\"p\",{className:\"text-xs opacity-50\",children:\"等待处理的消息\"})"
  },
  {
    "old": "children:\"Reject all\"}),p(\"span\",{className:\"hover:bg-secondary cursor-pointer select-none rounded bg-primary px-1 text-sm text-primary-foreground\",onClick:()=>{(async()=>{let a=n.getState(),i=nB(a),s=Cte(a);r(\"CASCADE_CHANGES_ACCEPT_ALL\",si({extra:{trajectoryId:i??\"\",stepIndex:s?(s-1).toString():\"\"}},\"system-generated trajectory/step identifiers\")),await e()})()},children:\"Accept all\"})",
    "new": "children:\"全部拒绝\"}),p(\"span\",{className:\"hover:bg-secondary cursor-pointer select-none rounded bg-primary px-1 text-sm text-primary-foreground\",onClick:()=>{(async()=>{let a=n.getState(),i=nB(a),s=Cte(a);r(\"CASCADE_CHANGES_ACCEPT_ALL\",si({extra:{trajectoryId:i??\"\",stepIndex:s?(s-1).toString():\"\"}},\"system-generated trajectory/step identifiers\")),await e()})()},children:\"全部接受\"})"
  }
];

let failed = 0;
newTranslations.forEach(item => {
  if (!content.includes(item.old)) {
    console.error(`❌ NOT FOUND: ${JSON.stringify(item.old)}`);
    failed++;
  } else {
    console.log(`✅ FOUND: ${item.old.substring(0, 40)}...`);
  }
});

if (failed > 0) {
  console.error(`Total missing: ${failed}`);
  process.exit(1);
} else {
  console.log("All entries verified successfully!");
}
