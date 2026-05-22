import fs from 'fs';

const nlsPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json.bak';
const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));

const indices = [309532, 317504, 317535, 317506, 317508];
indices.forEach(idx => {
  console.log(`[Index ${idx}] -> "${nls[idx]}"`);
});
