import fs from 'fs';
import path from 'path';

const appDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(walkDir(file));
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

try {
  const files = walkDir(appDir);
  console.log(`Found ${files.length} js/json files under app directory.`);

  const targets = [
    'jetskiAgent',
    'main.js',
    'corrupt',
    'damage',
    'integrity',
    'hash',
    'sha256',
    'md5',
    '损坏'
  ];

  files.forEach(file => {
    // Skip target main.js and its backup to avoid self-match noise
    if (file.includes('jetskiAgent\\main.js')) return;

    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (e) {
      return;
    }

    targets.forEach(target => {
      if (content.includes(target)) {
        console.log(`\nMatch found for "${target}" in file: ${file}`);
        let idx = 0;
        let count = 0;
        while (true) {
          idx = content.indexOf(target, idx);
          if (idx === -1) break;
          count++;
          if (count <= 10) {
            console.log(`  Occurrence ${count} at index ${idx}:`);
            console.log(`    ${content.substring(idx - 100, idx + target.length + 150).replace(/\n/g, ' ')}`);
          }
          idx += target.length;
        }
        if (count > 10) {
          console.log(`  (and ${count - 10} more occurrences...)`);
        }
      }
    });
  });

} catch (err) {
  console.error('Error walking directory:', err.message);
}
