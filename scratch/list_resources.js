import fs from 'fs';
import path from 'path';

const resourcesDir = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources';
if (fs.existsSync(resourcesDir)) {
  console.log(fs.readdirSync(resourcesDir));
} else {
  console.log('resources directory not found');
}
