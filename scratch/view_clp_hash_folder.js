import fs from 'fs';
import path from 'path';

const roamingPath = 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE';
const hashFolder = path.join(roamingPath, 'clp', 'd3faf449a4fb0681e7b05458b33193c8.zh-cn', 'bd0307c171dbaf4cd6135192515e160af7d9d132');

if (fs.existsSync(hashFolder)) {
  console.log(`Hash folder: ${hashFolder}`);
  const list = fs.readdirSync(hashFolder);
  console.log('Files inside hash folder:', list);
  
  // Let's see if there is any file containing main or nls
  list.forEach(f => {
    const pFile = path.join(hashFolder, f);
    const stat = fs.statSync(pFile);
    console.log(`- ${f} (${stat.size} bytes)`);
  });
} else {
  console.log('Hash folder not found');
}
