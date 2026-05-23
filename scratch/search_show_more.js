import fs from 'fs';
import path from 'path';

const resourcesDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(resourcesDir, 'nls.messages.json');

if (fs.existsSync(nlsPath)) {
  const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  nls.forEach((msg, idx) => {
    if (typeof msg === 'string' && msg.includes('Show') && msg.includes('more')) {
      console.log(`NLS Index ${idx}: "${msg}"`);
    }
  });
}

const clpDir = 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE\\clp';
if (fs.existsSync(clpDir)) {
  function searchClp(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        searchClp(fullPath);
      } else if (file === 'nls.messages.json') {
        const clpNls = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        clpNls.forEach((msg, idx) => {
          if (typeof msg === 'string' && msg.includes('Show') && msg.includes('more')) {
            console.log(`CLP ${fullPath} - Index ${idx}: "${msg}"`);
          }
        });
      }
    });
  }
  searchClp(clpDir);
}
