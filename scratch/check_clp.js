import fs from 'fs';
import path from 'path';

const roamingPath = 'C:\\Users\\i-cgh\\AppData\\Roaming\\Antigravity IDE';
if (fs.existsSync(roamingPath)) {
  console.log(`Found Roaming AppData directory: ${roamingPath}`);
  const list = fs.readdirSync(roamingPath);
  console.log('Contents:', list);
  
  const clpPath = path.join(roamingPath, 'clp');
  if (fs.existsSync(clpPath)) {
    console.log('clp folder exists. Contents:', fs.readdirSync(clpPath));
  } else {
    console.log('clp folder does not exist');
  }
} else {
  console.log('Roaming AppData folder for Antigravity IDE does not exist');
}
