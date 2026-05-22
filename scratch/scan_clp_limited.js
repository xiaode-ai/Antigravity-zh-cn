import fs from 'fs';
import path from 'path';

const clpDir = 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE\\clp';

if (!fs.existsSync(clpDir)) {
  console.log('CLP dir not found:', clpDir);
  process.exit(0);
}

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else if (file === 'nls.messages.json' || file === 'nls.messages.json.bak') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const nlsFiles = walk(clpDir);
console.log(`Found ${nlsFiles.length} NLS files in CLP.`);

nlsFiles.forEach(f => {
  try {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    console.log(`\nFile: ${f} (length: ${data.length})`);
    
    // Check specific indices
    const indicesToCheck = [5008, 5015, 5018, 4978, 4979, 4980, 6128, 6307, 6309, 317504, 317535];
    indicesToCheck.forEach(idx => {
      if (idx < data.length) {
        console.log(`  Index ${idx}: "${data[idx]}"`);
      }
    });

    // Let's also find all indices that contain exact "Limited" or "Fast"
    data.forEach((val, idx) => {
      if (val === 'Limited') {
        console.log(`  Found "Limited" at index ${idx}`);
      }
      if (val === 'Fast') {
        console.log(`  Found "Fast" at index ${idx}`);
      }
      if (val === 'Slow') {
        console.log(`  Found "Slow" at index ${idx}`);
      }
    });
  } catch (err) {
    console.error(`Error processing ${f}:`, err.message);
  }
});
