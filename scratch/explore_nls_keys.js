import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const keysPath = path.join(targetDir, 'nls.keys.json');

if (fs.existsSync(keysPath)) {
  const keys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
  console.log('Type of keys:', typeof keys);
  console.log('Is array:', Array.isArray(keys));
  if (Array.isArray(keys)) {
    console.log('Length:', keys.length);
    console.log('Sample keys (indices 4960-4975):');
    for (let i = 4960; i <= 4975; i++) {
      console.log(`Index ${i}:`, keys[i]);
    }
  } else {
    const keysEntries = Object.keys(keys);
    console.log('Object keys count:', keysEntries.length);
    console.log('Sample entries:', keysEntries.slice(0, 10));
    console.log('Key for 4968:', keys['4968']);
  }
} else {
  console.log('nls.keys.json not found');
}
