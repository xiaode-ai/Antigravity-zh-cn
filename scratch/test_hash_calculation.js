import fs from 'fs';
import crypto from 'crypto';

const mainBakPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const content = fs.readFileSync(mainBakPath);

const sha256 = crypto.createHash('sha256').update(content).digest('base64').replace(/=+$/, '');
console.log(`Calculated base64 hash: ${sha256}`);
console.log(`Expected expected hash: QpZq9PfZYQok3wydTPUNjUoBMr4ozDU3EcM2iAAbX78`);
console.log(`Match? ${sha256 === 'QpZq9PfZYQok3wydTPUNjUoBMr4ozDU3EcM2iAAbX78' ? 'YES' : 'NO'}`);
