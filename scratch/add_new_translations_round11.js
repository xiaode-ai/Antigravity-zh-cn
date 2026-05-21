import fs from 'fs';

const translationsPath = 'translations.json';
const data = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const newEntries = [
  {
    "old": "id:\"history-tooltip\",place:\"bottom-end\",children:\"Past Conversations\"",
    "new": "id:\"history-tooltip\",place:\"bottom-end\",children:\"历史对话\""
  },
  {
    "old": "id:f,place:\"bottom-end\",children:\"Additional Options\"",
    "new": "id:f,place:\"bottom-end\",children:\"更多选项\""
  },
  {
    "old": "id:h,place:\"bottom-end\",children:\"Close Agent View\"",
    "new": "id:h,place:\"bottom-end\",children:\"关闭智能体视图\""
  },
  {
    "old": "children:\"AI may make mistakes. Double-check all generated code.\"",
    "new": "children:\"AI 可能会犯错。请仔细检查生成的代码。\""
  },
  {
    "old": "H=x?p(jt,{children:[\"Record Audio \",p(\"span\",{className:\"opacity-50\",children:j})]}):\"Record Audio\",ee=x?p(jt,{children:[\"Stop Recording \",p(\"span\",{className:\"opacity-50\",children:j})]}):\"Recording\"",
    "new": "H=x?p(jt,{children:[\"录制音频 \",p(\"span\",{className:\"opacity-50\",children:j})]}):\"录制音频\",ee=x?p(jt,{children:[\"停止录音 \",p(\"span\",{className:\"opacity-50\",children:j})]}):\"正在录音\""
  },
  {
    "old": "z=x?R(tn,{children:[\"Record Audio \",R(\"span\",{className:\"opacity-50\",children:J})]}):\"Record Audio\",ne=x?R(tn,{children:[\"Stop Recording \",R(\"span\",{className:\"opacity-50\",children:J})]}):\"Recording\"",
    "new": "z=x?R(tn,{children:[\"录制音频 \",R(\"span\",{className:\"opacity-50\",children:J})]}):\"录制音频\",ne=x?R(tn,{children:[\"停止录音 \",R(\"span\",{className:\"opacity-50\",children:J})]}):\"正在录音\""
  },
  {
    "old": "label:\"Media\",onClick:Ye",
    "new": "label:\"媒体\",onClick:Ye"
  },
  {
    "old": "label:\"Mentions\",onClick:Wt",
    "new": "label:\"提及\",onClick:Wt"
  },
  {
    "old": "label:\"Media\",onClick:rt",
    "new": "label:\"媒体\",onClick:rt"
  },
  {
    "old": "label:\"Mentions\",onClick:Gi",
    "new": "label:\"提及\",onClick:Gi"
  },
  {
    "old": "title:{value:\"Agent\",original:\"Agent\"}",
    "new": "title:{value:\"智能体\",original:\"Agent\"}"
  },
  {
    "old": "name:{value:\"Agent\",original:\"Agent\"}",
    "new": "name:{value:\"智能体\",original:\"Agent\"}"
  },
  {
    "old": "className:\"text-muted-foreground\",children:\"Agent\"",
    "new": "className:\"text-muted-foreground\",children:\"智能体\""
  },
  {
    "old": "[cW.CASCADE]:{colorClass:\"bg-blue-500\",displayName:\"Agent\"}",
    "new": "[cW.CASCADE]:{colorClass:\"bg-blue-500\",displayName:\"智能体\"}"
  },
  {
    "old": "[wBe.CASCADE]:{colorClass:\"bg-blue-500\",displayName:\"Agent\"}",
    "new": "[wBe.CASCADE]:{colorClass:\"bg-blue-500\",displayName:\"智能体\"}"
  }
];

let added = 0;
newEntries.forEach(entry => {
  if (!data.some(d => d.old === entry.old)) {
    data.push(entry);
    added++;
  }
});

console.log(`Added ${added} new translations.`);
fs.writeFileSync(translationsPath, JSON.stringify(data, null, 2), 'utf8');
