import fs from 'fs';
import path from 'path';

const extBackupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\dist\\extension.js.bak';
const content = fs.readFileSync(extBackupPath, 'utf8');

const targetIndex = content.indexOf('Autocomplete Speed:');
console.log(content.substring(targetIndex - 300, targetIndex + 200));
