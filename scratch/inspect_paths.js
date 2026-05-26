import fs from 'fs';
import path from 'path';

const baseDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app';

const paths = [
  path.join(baseDir, 'out', 'jetskiAgent', 'main.js.bak'),
  path.join(baseDir, 'out', 'jetskiAgent', 'main.js'),
  path.join(baseDir, 'out', 'vs', 'workbench', 'workbench.desktop.main.js.bak'),
  path.join(baseDir, 'out', 'vs', 'workbench', 'workbench.desktop.main.js'),
  path.join(baseDir, 'extensions', 'antigravity', 'dist', 'extension.js.bak'),
  path.join(baseDir, 'extensions', 'antigravity', 'dist', 'extension.js'),
  path.join(baseDir, 'out', 'main.js.bak'),
  path.join(baseDir, 'out', 'main.js'),
];

paths.forEach(p => {
  console.log(`${p}: ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`);
});
