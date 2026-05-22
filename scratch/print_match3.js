import fs from 'fs';

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
const match3 = translations.find(t => t.old.includes('screen:"Permissions",label:"Terminal Command Auto Execution"') && t.old.includes('rl.PROCEED_IN_SANDBOX'));

if (match3) {
  console.log('OLD:\n', match3.old);
  console.log('NEW:\n', match3.new);
} else {
  console.log('Match 3 not found');
}
