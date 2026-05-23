import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out';
const mainPath = path.join(outDir, 'jetskiAgent', 'main.js');
const mainContent = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';

console.log(mainContent.substring(9532500, 9533300));
