import fs from 'fs';

const wbContent = fs.readFileSync('C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js', 'utf8');

const idx = wbContent.indexOf('c2i={lessThanXSeconds:');
if (idx !== -1) {
  console.log('workbench c2i found at index ' + idx);
  console.log(wbContent.substring(idx, idx + 1000));
} else {
  // partial search
  const idx2 = wbContent.indexOf('lessThanXSeconds:{one:');
  if (idx2 !== -1) {
    console.log('workbench lessThanXSeconds found at index ' + idx2);
    console.log(wbContent.substring(idx2 - 50, idx2 + 1000));
  } else {
    console.log('Not found in workbench');
  }
}
