import fs from 'fs';
import path from 'path';

const roamingPath = 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE';
const clpNlsPath = path.join(roamingPath, 'clp', 'd3faf449a4fb0681e7b05458b33193c8.zh-cn', 'bd0307c171dbaf4cd6135192515e160af7d9d132', 'nls.messages.json');

if (fs.existsSync(clpNlsPath)) {
  const content = fs.readFileSync(clpNlsPath, 'utf8');
  console.log(`clp/nls.messages.json size: ${content.length} characters`);
  try {
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      console.log('Format: Array');
      const indices = [4967, 4968, 3310, 4206, 3104, 4034, 16330];
      indices.forEach(idx => {
        console.log(`Index ${idx}: "${data[idx]}"`);
      });
    } else {
      console.log('Format: Object (not Array)');
      const keys = Object.keys(data);
      console.log(`Keys count: ${keys.length}`);
      console.log('Sample keys/values:', keys.slice(0, 10).map(k => `${k}: "${data[k]}"`));
      
      const searchKeys = ['Toggle Agent', 'Quick Open', 'Open Browser (Preview)', 'Profile', 'Agent'];
      searchKeys.forEach(key => {
        const matches = keys.filter(k => k.includes(key));
        console.log(`Matches for key "${key}":`, matches.slice(0, 5).map(m => `${m}: "${data[m]}"`));
      });
    }
  } catch (e) {
    console.error('Error parsing JSON:', e.message);
  }
} else {
  console.log('clpNlsPath not found:', clpNlsPath);
}
