import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js.bak');
const wbPath = path.join(outDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak');

const mainContent = fs.readFileSync(mainPath, 'utf8');
const wbContent = fs.readFileSync(wbPath, 'utf8');

const testMappings = [
  {
    "old": "ee(\"span\",void 0,\"Accept Changes\")",
    "new": "ee(\"span\",void 0,\"接受更改\")"
  },
  {
    "old": "this._fileNavDisplayText.replaceChildren(`Edited files ${e.index+1}/${i}`);",
    "new": "this._fileNavDisplayText.replaceChildren(`已编辑文件 ${e.index+1}/${i}`);"
  },
  {
    "old": "this._centerButton.text.textContent=`View ${e} edited file${e===1?\"\":\"s\"}`;",
    "new": "this._centerButton.text.textContent=`查看 ${e} 个已编辑的文件`;"
  },
  {
    "old": "children:[R(\"h5\",{className:\"mb-2 text-sm font-medium text-foreground\",children:\"Error\"}),",
    "new": "children:[R(\"h5\",{className:\"mb-2 text-sm font-medium text-foreground\",children:\"错误\"}),"
  },
  {
    "old": "children:[p(\"h5\",{className:\"mb-2 text-sm font-medium text-foreground\",children:\"Error\"}),",
    "new": "children:[p(\"h5\",{className:\"mb-2 text-sm font-medium text-foreground\",children:\"错误\"}),"
  },
  {
    "old": "if(l.status===cge.ERRORED)return{label:\"Error\",textColor:\"text-red-500\",iconColor:\"text-red-500\",badgeClass:\"bg-red-500/10 border-red-500/20\"};",
    "new": "if(l.status===cge.ERRORED)return{label:\"错误\",textColor:\"text-red-500\",iconColor:\"text-red-500\",badgeClass:\"bg-red-500/10 border-red-500/20\"};"
  },
  {
    "old": "if(u.status===KI.ERRORED)return{label:\"Error\",textColor:\"text-red-500\",iconColor:\"text-red-500\",badgeClass:\"bg-red-500/10 border-red-500/20\"};",
    "new": "if(u.status===KI.ERRORED)return{label:\"错误\",textColor:\"text-red-500\",iconColor:\"text-red-500\",badgeClass:\"bg-red-500/10 border-red-500/20\"};"
  },
  {
    "old": "children:n||(ll(t)?\"Searching\":\"Searched\")",
    "new": "children:n||(ll(t)?\"正在搜索\":\"已搜索\")"
  },
  {
    "old": "children:n||(za(e)?\"Searching\":\"Searched\")",
    "new": "children:n||(za(e)?\"正在搜索\":\"已搜索\")"
  },
  {
    "old": "prefix:f?\"Searching Moma for\":\"Searched Moma for\"",
    "new": "prefix:f?\"正在 Moma 中搜索\":\"已在 Moma 中搜索\""
  },
  {
    "old": "prefix:b?\"Searching Moma for\":\"Searched Moma for\"",
    "new": "prefix:b?\"正在 Moma 中搜索\":\"已在 Moma 中搜索\""
  },
  {
    "old": "grepSearch:e=>e.query?`Searched for \"${e.query}\"`:\"Searched files\"",
    "new": "grepSearch:e=>e.query?`已搜索 \"${e.query}\"`:\"已搜索文件\""
  },
  {
    "old": "grepSearch:t=>t.query?`Searched for \"${t.query}\"`:\"Searched files\"",
    "new": "grepSearch:t=>t.query?`已搜索 \"${t.query}\"`:\"已搜索文件\""
  },
  {
    "old": "find:e=>e.pattern?`Searched for files: ${e.pattern}`:\"Searched for files\"",
    "new": "find:e=>e.pattern?`已检索文件：${e.pattern}`:\"已检索文件\""
  },
  {
    "old": "find:t=>t.pattern?`Searched for files: ${t.pattern}`:\"Searched for files\"",
    "new": "find:t=>t.pattern?`已检索文件：${t.pattern}`:\"已检索文件\""
  },
  {
    "old": "searchWeb:e=>e.query?`Searched web: \"${e.query}\"`:\"Searched web\"",
    "new": "searchWeb:e=>e.query?`已搜索网页：\"${e.query}\"`:\"已搜索网页\""
  },
  {
    "old": "searchWeb:t=>t.query?`Searched web: \"${t.query}\"`:\"Searched web\"",
    "new": "searchWeb:t=>t.query?`已搜索网页：\"${t.query}\"`:\"已搜索网页\""
  }
];

let allPassed = true;
testMappings.forEach((mapping, idx) => {
  const inMain = mainContent.includes(mapping.old);
  const inWb = wbContent.includes(mapping.old);
  console.log(`[Mapping ${idx + 1}] "${mapping.old.substring(0, 45)}..."`);
  console.log(`  Found in main: ${inMain}`);
  console.log(`  Found in wb  : ${inWb}`);
  if (!inMain && !inWb) {
    console.error(`  ❌ ERROR: Not found in either file!`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log(`\n🎉 SUCCESS! All test mappings matched successfully.`);
} else {
  console.error(`\n❌ FAILED! One or more mappings failed to match.`);
}
