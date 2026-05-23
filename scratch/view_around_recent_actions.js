import fs from 'fs';

const filePath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\main.js";
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Search for ERRORED
  let index = 0;
  while (true) {
    index = content.indexOf("ERRORED", index);
    if (index === -1) break;
    
    console.log(`[ERRORED] at Pos ${index}`);
    console.log(content.substring(index - 100, index + 100));
    index += 7;
  }
  
  // Search for label:"Error" or children:"Error" or children: "Error"
  const terms = [
    'label:"Error"',
    "label:'Error'",
    'children:"Error"',
    "children:'Error'"
  ];
  for (const term of terms) {
    let idx = 0;
    while (true) {
      idx = content.indexOf(term, idx);
      if (idx === -1) break;
      
      console.log(`[${term}] at Pos ${idx}`);
      console.log(content.substring(idx - 100, idx + 100));
      idx += term.length;
    }
  }
}
