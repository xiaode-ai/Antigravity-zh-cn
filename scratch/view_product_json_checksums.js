import fs from 'fs';
import path from 'path';

const productPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\product.json';

if (fs.existsSync(productPath)) {
  const content = fs.readFileSync(productPath, 'utf8');
  const data = JSON.parse(content.replace(/\uFEFF/g, ''));
  if (data.checksums) {
    console.log('Checksums keys:');
    console.log(Object.keys(data.checksums));
  } else {
    console.log('No checksums property found.');
  }
} else {
  console.log('product.json not found.');
}
