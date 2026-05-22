import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full, callback);
    } else if (f === 'package.json') {
      callback(full);
    }
  });
}

walk(appDir, (p) => {
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (data.contributes && (data.contributes.viewsContainers || data.contributes.views)) {
      console.log(`\n================= ${p} =================`);
      if (data.contributes.viewsContainers) {
        console.log('viewsContainers:', JSON.stringify(data.contributes.viewsContainers, null, 2));
      }
      if (data.contributes.views) {
        console.log('views:', JSON.stringify(data.contributes.views, null, 2));
      }
    }
  } catch (e) {}
});
