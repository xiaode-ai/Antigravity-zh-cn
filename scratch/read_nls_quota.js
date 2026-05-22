import fs from 'fs';
import path from 'path';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';
if (fs.existsSync(nlsPath)) {
  const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  for (let i = 6110; i <= 6135; i++) {
    console.log(`Index ${i}: "${nls[i]}"`);
  }
} else {
  console.log("NLS file not found");
}
