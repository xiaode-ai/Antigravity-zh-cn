import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'translations.json');

const nfeOld = `nFe=({name:e,path:t,description:r,badge:n,disabled:a=!1,isLast:i=!1,onEdit:s,editTitle:o="Edit",onDelete:u,deleteTitle:d="Delete",onToggle:f,toggleChecked:g,expandableContent:b})=>{let y=s||u||f,[F,C]=_e(!1),N=mi(),V=\`\${N}-name\`,I=\`\${N}-copy\`,x=\`\${N}-edit\`,D=\`\${N}-delete\`,U=de(()=>{t&&(navigator.clipboard.writeText(t),C(!0),setTimeout(()=>C(!1),2e3))},[t]);return p("div",{className:\`group flex items-start justify-between gap-3 px-3 py-2 border-border \${i?"":"border-b"}\`,children:[p("div",{className:"flex flex-col gap-0.5 min-w-0 flex-1 space-y-1",children:[p("div",{className:"flex items-center gap-2",children:[p("span",{className:\`text-sm font-medium truncate \${a?"line-through opacity-40":""}\`,"data-tooltip-id":V,children:e}),t&&p(_n,{id:V,delayShow:200,children:t}),n]}),r&&p("div",{className:"text-xs text-muted-foreground line-clamp-2 mt-1",children:r}),b]}),(y||t)&&p("div",{className:"flex items-center gap-3 shrink-0 mt-1 relative",children:[p("div",{className:"flex items-center gap-0.5",children:[t&&p(jt,{children:[p("button",{onClick:U,className:"p-1 rounded hover:bg-secondary transition-all opacity-20 group-hover:opacity-100\",\"data-tooltip-id\":I,children:F?p(qe,{name:"check",className:"w-4 h-4 text-green-500"}):p(qe,{name:"content_copy",className:"w-4 h-4"})}),p(_n,{id:I,delayShow:200,children:"Copy path"})]}),s&&p(jt,{children:[p("button",{className:"p-1 hover:bg-secondary rounded transition-colors\",onClick:s,\"data-tooltip-id\":x,children:p(qe,{name:\"edit_note\",className:\"w-4 h-4 opacity-60 hover:opacity-100\"})}),p(_n,{id:x,delayShow:200,children:o})]}),u&&p(jt,{children:[p("button",{className:\"p-1 hover:bg-red-500/20 rounded transition-colors\",onClick:u,\"data-tooltip-id\":D,children:p(qe,{name:\"delete\",className:\"w-4 h-4 opacity-60 hover:opacity-100 text-red-400\"})}),p(_n,{id:D,delayShow:200,children:d})]})]}),f&&g!==void 0&&p(nF,{checked:g,onCheckedChange:f}),F&&p("div",{className:"absolute top-full right-0 mt-1 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-md z-50 pointer-events-none",children:"Path copied!"})]})]})}`;

const nfeNew = `nFe=({name:e,path:t,description:r,badge:n,disabled:a=!1,isLast:i=!1,onEdit:s,editTitle:o="编辑",onDelete:u,deleteTitle:d="删除",onToggle:f,toggleChecked:g,expandableContent:b})=>{let y=s||u||f,[F,C]=_e(!1),N=mi(),V=\`\${N}-name\`,I=\`\${N}-copy\`,x=\`\${N}-edit\`,D=\`\${N}-delete\`,U=de(()=>{t&&(navigator.clipboard.writeText(t),C(!0),setTimeout(()=>C(!1),2e3))},[t]);return p("div",{className:\`group flex items-start justify-between gap-3 px-3 py-2 border-border \${i?"":"border-b"}\`,children:[p("div",{className:"flex flex-col gap-0.5 min-w-0 flex-1 space-y-1",children:[p("div",{className:"flex items-center gap-2",children:[p("span",{className:\`text-sm font-medium truncate \${a?"line-through opacity-40":""}\`,"data-tooltip-id":V,children:e}),t&&p(_n,{id:V,delayShow:200,children:t}),n]}),r&&p("div",{className:"text-xs text-muted-foreground line-clamp-2 mt-1",children:r}),b]}),(y||t)&&p("div",{className:"flex items-center gap-3 shrink-0 mt-1 relative",children:[p("div",{className:"flex items-center gap-0.5",children:[t&&p(jt,{children:[p("button",{onClick:U,className:"p-1 rounded hover:bg-secondary transition-all opacity-20 group-hover:opacity-100\",\"data-tooltip-id\":I,children:F?p(qe,{name:"check",className:"w-4 h-4 text-green-500"}):p(qe,{name:"content_copy",className:"w-4 h-4"})}),p(_n,{id:I,delayShow:200,children:"复制路径"})]}),s&&p(jt,{children:[p("button",{className:\"p-1 hover:bg-secondary rounded transition-colors\",onClick:s,\"data-tooltip-id\":x,children:p(qe,{name:\"edit_note\",className:\"w-4 h-4 opacity-60 hover:opacity-100\"})}),p(_n,{id:x,delayShow:200,children:o})]}),u&&p(jt,{children:[p("button",{className:\"p-1 hover:bg-red-500/20 rounded transition-colors\",onClick:u,\"data-tooltip-id\":D,children:p(qe,{name:\"delete\",className:\"w-4 h-4 opacity-60 hover:opacity-100 text-red-400\"})}),p(_n,{id:D,delayShow:200,children:d})]})]}),f&&g!==void 0&&p(nF,{checked:g,onCheckedChange:f}),F&&p("div",{className:"absolute top-full right-0 mt-1 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-md z-50 pointer-events-none",children:"路径已复制！"})]})]})}`;

const jsonContent = fs.readFileSync(filePath, 'utf8');
const parsed = JSON.parse(jsonContent);

let replaced = false;
for (let i = 0; i < parsed.length; i++) {
  if (parsed[i].old.startsWith('nFe=({name:e,path:t')) {
    parsed[i].old = nfeOld;
    parsed[i].new = nfeNew;
    replaced = true;
    console.log('Updated existing nFe translation entry.');
    break;
  }
}

if (!replaced) {
  parsed.push({
    old: nfeOld,
    new: nfeNew
  });
  console.log('Appended nFe translation entry.');
}

fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf8');
console.log('Successfully wrote updated translations.json!');
