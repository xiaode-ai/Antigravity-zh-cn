import fs from 'fs';
const data = JSON.parse(fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\nls.messages.json', 'utf8'));
if (Array.isArray(data)) {
  console.log('Structure: Array');
  console.log('Length:', data.length);
  console.log('First 20 items:', data.slice(0, 20));
} else {
  console.log('Structure: Object');
  const keys = Object.keys(data);
  console.log('Keys count:', keys.length);
  console.log('First 20 keys:', keys.slice(0, 20).map(k => `${k}: ${data[k]}`));
}
