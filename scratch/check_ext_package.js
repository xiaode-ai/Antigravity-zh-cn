import fs from 'fs';

const packagePath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\extensions\\antigravity\\package.json';
if (!fs.existsSync(packagePath)) {
  console.log('package.json not found!');
  process.exit(1);
}

const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// We log views and viewsContainers
console.log('--- viewsContainers ---');
if (packageData.contributes && packageData.contributes.viewsContainers) {
  console.log(JSON.stringify(packageData.contributes.viewsContainers, null, 2));
}

console.log('--- views ---');
if (packageData.contributes && packageData.contributes.views) {
  console.log(JSON.stringify(packageData.contributes.views, null, 2));
}
