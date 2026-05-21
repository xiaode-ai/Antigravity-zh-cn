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
      if (file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

try {
  const files = walkDir(appDir);
  let output = `Found ${files.length} js files under app directory.\n`;

  const targets = [
    '_isPure',
    'isPure',
    'checksums',
    '损坏',
    'corrupt'
  ];

  files.forEach(file => {
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (e) {
      return;
    }

    targets.forEach(target => {
      if (content.includes(target)) {
        output += `\nMatch found for "${target}" in file: ${file}\n`;
        let idx = 0;
        let count = 0;
        while (true) {
          idx = content.indexOf(target, idx);
          if (idx === -1) break;
          count++;
          if (count <= 20) {
            output += `  Occurrence ${count} at index ${idx}:\n`;
            output += `    ${content.substring(idx - 100, idx + target.length + 150).replace(/\n/g, ' ')}\n`;
          }
          idx += target.length;
        }
        if (count > 20) {
          output += `  (and ${count - 20} more occurrences...)\n`;
        }
      }
    });
  });

  fs.writeFileSync('scratch/integrity_search_results.txt', output, 'utf8');
  console.log('Done writing search results to scratch/integrity_search_results.txt');
} catch (err) {
  console.error('Error:', err.message);
}
