import fs from 'fs';
import path from 'path';

const productPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\product.json';

function check() {
  if (!fs.existsSync(productPath)) {
    console.log('product.json not found.');
    return;
  }
  const content = fs.readFileSync(productPath, 'utf8');
  const data = JSON.parse(content.replace(/\uFEFF/g, ''));
  console.log('Checksums keys in product.json:');
  if (data.checksums) {
    Object.keys(data.checksums).forEach(key => {
      console.log(` - "${key}": "${data.checksums[key]}"`);
    });
  } else {
    console.log('No checksums field found.');
  }
}

check();
