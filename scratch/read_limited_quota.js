import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const idx = content.indexOf('renderLimitedQuotaItem');
  if (idx !== -1) {
    console.log(`Found renderLimitedQuotaItem at index: ${idx}`);
    console.log(content.substring(idx - 200, idx + 2000));
  } else {
    console.log("renderLimitedQuotaItem not found");
  }
} else {
  console.log("File not found");
}
