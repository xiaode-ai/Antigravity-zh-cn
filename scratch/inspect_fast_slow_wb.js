import fs from 'fs';
import path from 'path';

const filePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js.bak';

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const idx = 26920261;
  const start = idx - 150;
  const end = idx + 200;
  console.log('Context:');
  console.log(content.substring(start, end));
} else {
  console.error('File not found:', filePath);
}
