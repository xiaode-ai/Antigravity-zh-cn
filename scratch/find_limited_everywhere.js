import fs from 'fs';
import path from 'path';

const targetDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

let output = [];
function log(msg) {
  console.log(msg);
  output.push(msg);
}

log(`=== Scanning all files in ${targetDir} ===`);

walkDir(targetDir, (filePath) => {
  // Only search text files (.js, .json, .html, .css)
  const ext = path.extname(filePath);
  if (!['.js', '.json', '.html', '.css'].includes(ext)) {
    return;
  }
  
  // Skip backup files
  if (filePath.endsWith('.bak')) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for limited (but not delimited)
  // We look for "limited" as a whole word or followed by spaces/words, but not preceded by "de"
  const limitedRegex = /(?<!de)limited\b/gi;
  let match;
  let matchesCount = 0;
  while ((match = limitedRegex.exec(content)) !== null) {
    matchesCount++;
    if (matchesCount > 10) {
      log(`[${filePath}] Too many limited matches, skipping remainder.`);
      break;
    }
    const idx = match.index;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + match[0].length + 100);
    log(`[MATCH limited in ${path.relative(targetDir, filePath)}] at index ${idx}:`);
    log(`  Context: ... ${content.substring(start, end).replace(/\r?\n/g, ' ')} ...`);
  }
});

fs.writeFileSync(path.join(process.cwd(), 'scratch', 'limited_everywhere_results.txt'), output.join('\n'), 'utf8');
log(`\n[OK] Wrote results to scratch/limited_everywhere_results.txt`);
