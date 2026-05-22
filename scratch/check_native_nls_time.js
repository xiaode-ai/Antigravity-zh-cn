import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const nlsPath = path.join(outDir, 'nls.messages.json');
const nlsBackupPath = nlsPath + '.bak';

const targets = [
  { index: 48, expected: 'now' },
  { index: 49, expected: '{0} second ago' },
  { index: 51, expected: '{0} seconds ago' },
  { index: 57, expected: '{0} minute ago' },
  { index: 59, expected: '{0} minutes ago' },
  { index: 65, expected: '{0} hour ago' },
  { index: 67, expected: '{0} hours ago' },
  { index: 73, expected: '{0} day ago' },
  { index: 74, expected: '{0} days ago' }
];

console.log('=== MAIN NLS CHECK ===');
if (fs.existsSync(nlsPath)) {
  const mainNls = JSON.parse(fs.readFileSync(nlsPath, 'utf8'));
  const mainNlsBak = fs.existsSync(nlsBackupPath) ? JSON.parse(fs.readFileSync(nlsBackupPath, 'utf8')) : null;
  targets.forEach(t => {
    console.log(`Index ${t.index}:`);
    console.log(`  Current:  "${mainNls[t.index]}"`);
    if (mainNlsBak) {
      console.log(`  Original: "${mainNlsBak[t.index]}"`);
    }
  });
} else {
  console.log('nls.messages.json not found');
}

console.log('\n=== CLP NLS CHECK ===');
const clpDir = 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE\\clp';
if (fs.existsSync(clpDir)) {
  const clpNlsFiles = [];
  function walkClp(dir) {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walkClp(fullPath);
      } else if (file.toLowerCase() === 'nls.messages.json') {
        clpNlsFiles.push(fullPath);
      }
    });
  }
  walkClp(clpDir);
  console.log(`Found ${clpNlsFiles.length} CLP files.`);
  clpNlsFiles.forEach(clpPath => {
    console.log(`\nCLP: ${clpPath}`);
    const clpNls = JSON.parse(fs.readFileSync(clpPath, 'utf8'));
    targets.forEach(t => {
      console.log(`  Index ${t.index}: "${clpNls[t.index]}"`);
    });
  });
} else {
  console.log('CLP dir not found');
}
