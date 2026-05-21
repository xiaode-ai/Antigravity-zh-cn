import fs from 'fs';
const data = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
data.forEach((p, i) => {
  const oldLower = (p.old || '').toLowerCase();
  const newStr = p.new || '';
  if (
    oldLower.includes('email') ||
    oldLower.includes('e-mail') ||
    newStr.includes('邮') ||
    newStr.includes('电子')
  ) {
    console.log(`[${i}] old: ${JSON.stringify(p.old).substring(0, 100)}`);
    console.log(`     new: ${JSON.stringify(p.new).substring(0, 100)}`);
    console.log('');
  }
});
