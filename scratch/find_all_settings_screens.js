import fs from 'fs';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(backupPath, 'utf8');

const screens = [
  'General',
  'Account',
  'Permissions',
  'Appearance',
  'Notifications',
  'Models',
  'Customizations',
  'Browser',
  'Tab',
  'Editor',
];

for (const screen of screens) {
  const pattern = `["${screen}"`;
  const idx = content.indexOf(pattern);
  console.log(`Searching for ${pattern}: ${idx !== -1 ? 'Found at ' + idx : 'Not Found'}`);
}
