import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const files = [
  path.join(targetDir, 'jetskiAgent', 'main.js.bak'),
  path.join(targetDir, 'vs', 'workbench', 'workbench.desktop.main.js.bak')
];

const patterns = [
  "getRenderInfo(){let e=this.type===0?\"Files\":this.type===1?\"Directories\":\"Code Context Items\",t=this.type===0?p(Trt,{size:14}):this.type===1?p(PBr,{size:14}):p(ldi",
  "getRenderInfo(){let t=this.type===0?\"Files\":this.type===1?\"Directories\":\"Code Context Items\",e=this.type===0?R(msn,{size:14}):this.type===1?R(Xio,{size:14}):R(HJc"
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`\n=== Scanning ${path.basename(filePath)} ===`);
  const content = fs.readFileSync(filePath, 'utf8');
  patterns.forEach((pat, i) => {
    const idx = content.indexOf(pat);
    if (idx !== -1) {
      console.log(`Pattern ${i} found at index ${idx}!`);
    } else {
      console.log(`Pattern ${i} NOT found`);
    }
  });
});
