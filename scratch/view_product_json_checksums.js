import fs from 'fs';

const productPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\product.json';
const data = JSON.parse(fs.readFileSync(productPath, 'utf8'));

// 找出包含 jetskiAgent/main.js 的 key 和所在的父节点
function findPath(obj, targetKey, currentPath = '') {
  for (let key in obj) {
    if (key === targetKey) {
      console.log(`Found exact key match at path: ${currentPath}.${key} = ${obj[key]}`);
    }
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      findPath(obj[key], targetKey, currentPath ? `${currentPath}.${key}` : key);
    }
  }
}

findPath(data, 'jetskiAgent/main.js');

// 打印 checksums 父节点的内容
if (data.checksums) {
  console.log('\n--- checksums in product.json ---');
  console.log(JSON.stringify(data.checksums, null, 2).substring(0, 1000));
}
