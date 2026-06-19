import fs from 'fs';
import path from 'path';
import asar from 'asar';

const asarPath = "C:\\Users\\i-cgh\\AppData\\Local\\Programs\\antigravity\\resources\\app.asar";
if (!fs.existsSync(asarPath)) {
  console.log('未找到已汉化的 app.asar:', asarPath);
} else {
  try {
    const buf = asar.extractFile(asarPath, 'dist/utils.js');
    const content = buf.toString('utf8');
    fs.writeFileSync('scratch/extracted_utils.js', content, 'utf8');
    console.log('已写入 scratch/extracted_utils.js');
    console.log('content includes dictionary?', content.includes('dictionary'));
    console.log('content includes loadURL?', content.includes('loadURL'));
  } catch (e) {
    console.error('提取失败:', e.message);
  }
}
