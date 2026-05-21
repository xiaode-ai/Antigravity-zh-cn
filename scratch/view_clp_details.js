import fs from 'fs';
import path from 'path';

const roamingPath = 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE';

// Read languagepacks.json
const lpPath = path.join(roamingPath, 'languagepacks.json');
if (fs.existsSync(lpPath)) {
  console.log('--- languagepacks.json ---');
  console.log(fs.readFileSync(lpPath, 'utf8'));
}

// Read clp contents
const clpPath = path.join(roamingPath, 'clp', 'd3faf449a4fb0681e7b05458b33193c8.zh-cn');
if (fs.existsSync(clpPath)) {
  console.log(`--- clp/d3faf449a4fb0681e7b05458b33193c8.zh-cn ---`);
  const files = fs.readdirSync(clpPath);
  console.log('Files inside clp folder:', files);
  
  // Let's see if there is any json file in there and scan its keys
  files.forEach(f => {
    if (f.endsWith('.json')) {
      const filePath = path.join(clpPath, f);
      const stat = fs.statSync(filePath);
      console.log(`  - File: ${f} (${stat.size} bytes)`);
      if (f.includes('main') || stat.size < 50000) {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          console.log(`    Keys count: ${Object.keys(content).length}`);
          const sampleKeys = Object.keys(content).slice(0, 5);
          console.log(`    Sample keys:`, sampleKeys);
        } catch (e) {
          console.log(`    Error reading JSON: ${e.message}`);
        }
      }
    }
  });
}
