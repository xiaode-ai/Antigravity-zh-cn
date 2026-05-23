import fs from 'fs';
import path from 'path';

const translationsPath = './translations.json';
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const newMappings = [
  {
    "old": "children:[t?\"Recording\":\"Processing\",\"...\"]",
    "new": "children:[t?\"正在录音\":\"正在处理\",\"...\"]"
  },
  {
    "old": "tooltip:()=>`Terminal (${r})`,expandedContent:",
    "new": "tooltip:()=>`终端 (${r})`,expandedContent:"
  },
  {
    "old": "tooltip:()=>`Terminal (${i})`,expandedContent:",
    "new": "tooltip:()=>`终端 (${i})`,expandedContent:"
  },
  {
    "old": "getRenderInfo(){return{label:\"Terminal\",icon:p(jBr,{size:14})}}",
    "new": "getRenderInfo(){return{label:\"终端\",icon:p(jBr,{size:14})}}"
  },
  {
    "old": "getRenderInfo(){return{label:\"Terminal\",icon:R(Kio,{size:14})}}",
    "new": "getRenderInfo(){return{label:\"终端\",icon:R(Kio,{size:14})}}"
  },
  {
    "old": "title:\"Terminal\",settings:[To.CASCADE_AUTO_EXECUTION_POLICY",
    "new": "title:\"终端\",settings:[To.CASCADE_AUTO_EXECUTION_POLICY"
  },
  {
    "old": "Se&&Cr.push({icon:oA,label:\"Browser\",onClick:We})",
    "new": "Se&&Cr.push({icon:oA,label:\"浏览器\",onClick:We})"
  },
  {
    "old": "We&&xn.push({icon:MX,label:\"Browser\",onClick:ht})",
    "new": "We&&xn.push({icon:MX,label:\"浏览器\",onClick:ht})"
  },
  {
    "old": "a?{id:\"browser\",icon:p(oA,{className:\"h-4 w-4 opacity-90 hover:opacity-100\"}),title:\"Browser\",onExpanded:",
    "new": "a?{id:\"browser\",icon:p(oA,{className:\"h-4 w-4 opacity-90 hover:opacity-100\"}),title:\"浏览器\",onExpanded:"
  },
  {
    "old": "r?{id:\"browser\",icon:R(MX,{className:\"h-4 w-4 opacity-90 hover:opacity-100\"}),title:\"Browser\",onExpanded:",
    "new": "r?{id:\"browser\",icon:R(MX,{className:\"h-4 w-4 opacity-90 hover:opacity-100\"}),title:\"浏览器\",onExpanded:"
  },
  {
    "old": "inputBoxProps:{placeholder:\"Search all convos...\",prefix:rd.Conversations,",
    "new": "inputBoxProps:{placeholder:\"搜索所有对话...\",prefix:rd.Conversations,"
  },
  {
    "old": "inputBoxProps:{placeholder:\"Search all convos...\",isLoading:!1},",
    "new": "inputBoxProps:{placeholder:\"搜索所有对话...\",isLoading:!1},"
  },
  {
    "old": "a.length>0&&u.push({label:\"Current\",cascadeIds:a})",
    "new": "a.length>0&&u.push({label:\"当前\",cascadeIds:a})"
  },
  {
    "old": "r.length>0&&l.push({label:\"Current\",cascadeIds:r})",
    "new": "r.length>0&&l.push({label:\"当前\",cascadeIds:r})"
  },
  {
    "old": "(function(e){e[e.Current=0]=\"Current\",e[e.Outdated=1]=\"Outdated\"})(cUn||(cUn={}))",
    "new": "(function(e){e[e.Current=0]=\"当前\",e[e.Outdated=1]=\"已过时\"})(cUn||(cUn={}))"
  },
  {
    "old": "(function(t){t[t.Current=0]=\"Current\",t[t.Outdated=1]=\"Outdated\"})(Y2||(Y2={}))",
    "new": "(function(t){t[t.Current=0]=\"当前\",t[t.Outdated=1]=\"已过时\"})(Y2||(Y2={}))"
  },
  {
    "old": "(function(t){t[t.Current=0]=\"Current\",t[t.Outdated=1]=\"Outdated\"})(E8o||(E8o={}))",
    "new": "(function(t){t[t.Current=0]=\"当前\",t[t.Outdated=1]=\"已过时\"})(E8o||(E8o={}))"
  },
  {
    "old": "var nfn=(e,t)=>za(e)?\"Run\":e===On.DONE?\"Ran\":t?\"Rejected\":e===On.CANCELED?\"Canceled\":e===On.ERROR?\"Errored\":\"Terminal\"",
    "new": "var nfn=(e,t)=>za(e)?\"运行\":e===On.DONE?\"已运行\":t?\"已拒绝\":e===On.CANCELED?\"已取消\":e===On.ERROR?\"已出错\":\"终端\""
  },
  {
    "old": "var b9o=(t,e)=>ll(t)?\"Run\":t===$s.DONE?\"Ran\":e?\"Rejected\":t===$s.CANCELED?\"Canceled\":t===$s.ERROR?\"Errored\":\"Terminal\"",
    "new": "var b9o=(t,e)=>ll(t)?\"运行\":t===$s.DONE?\"已运行\":e?\"已拒绝\":t===$s.CANCELED?\"已取消\":t===$s.ERROR?\"已出错\":\"终端\""
  },
  {
    "old": "p(\"span\",{children:\"to navigate\"})",
    "new": "p(\"span\",{children:\"导航\"})"
  },
  {
    "old": "R(\"span\",{children:\"to navigate\"})",
    "new": "R(\"span\",{children:\"导航\"})"
  },
  {
    "old": "p(\"span\",{children:\"to select\"})",
    "new": "p(\"span\",{children:\"选择\"})"
  },
  {
    "old": "R(\"span\",{children:\"to select\"})",
    "new": "R(\"span\",{children:\"选择\"})"
  },
  {
    "old": "children:[\"Show \",n,\" more...\"]",
    "new": "children:[\"显示另外 \",n,\" 个...\"]"
  },
  {
    "old": "children:[\"...and \",a-u,\" more\"]",
    "new": "children:[\"...以及另外 \",a-u,\" 个\"]"
  },
  {
    "old": "children:[\"...and \",F-C,\" more\"]",
    "new": "children:[\"...以及另外 \",F-C,\" 个\"]"
  },
  {
    "old": "children:[\"...and \",y-F,\" more\"]",
    "new": "children:[\"...以及另外 \",y-F,\" 个\"]"
  },
  {
    "old": "children:[\"...and \",b-y,\" more\"]",
    "new": "children:[\"...以及另外 \",b-y,\" 个\"]"
  },
  {
    "old": "children:[\"...and \",r-l,\" more\"]",
    "new": "children:[\"...以及另外 \",r-l,\" 个\"]"
  },
  {
    "old": "children:[\"...and \",v-b,\" more\"]",
    "new": "children:[\"...以及另外 \",v-b,\" 个\"]"
  },
  {
    "old": "children:[\"...and \",g-v,\" more\"]",
    "new": "children:[\"...以及另外 \",g-v,\" 个\"]"
  },
  {
    "old": "children:[\"...and \",f-g,\" more\"]",
    "new": "children:[\"...以及另外 \",f-g,\" 个\"]"
  },
  {
    "old": "children:[p(qe,{name:\"add\",className:\"shrink-0 h-4 w-4\"}),\"Show \",V-x,\" more\"]",
    "new": "children:[p(qe,{name:\"add\",className:\"shrink-0 h-4 w-4\"}),\"显示另外 \",V-x,\" 个\"]"
  },
  {
    "old": "children:[R(Ut,{name:\"add\",className:\"shrink-0 h-4 w-4\"}),\"Show \",S-x,\" more\"]",
    "new": "children:[R(Ut,{name:\"add\",className:\"shrink-0 h-4 w-4\"}),\"显示另外 \",S-x,\" 个\"]"
  },
  {
    "old": "children:[\"+\",e.length-s.top-s.bottom,\" more\",\" \",e.length-s.top-s.bottom===1?\"line\":\"lines\"]",
    "new": "children:[\"+ 另外 \",e.length-s.top-s.bottom,\" 行\"]"
  },
  {
    "old": "children:[\"+\",t.length-o.top-o.bottom,\" more\",\" \",t.length-o.top-o.bottom===1?\"line\":\"lines\"]",
    "new": "children:[\"+ 另外 \",t.length-o.top-o.bottom,\" 行\"]"
  }
];

// Append and filter duplicates
let addedCount = 0;
newMappings.forEach(mapping => {
  if (!translations.some(t => t.old === mapping.old)) {
    translations.push(mapping);
    addedCount++;
  }
});

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} new translations (total: ${translations.length}).`);
