import fs from 'fs';

const translationsPath = 'translations.json';
let translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

console.log(`Original entries count: ${translations.length}`);

// 1. Filter out unsafe generic entries
const unsafeOlds = ['"Error"', '"Errors"', '"Error: "', '"Prompt"'];
const initialCount = translations.length;
translations = translations.filter(t => !unsafeOlds.includes(t.old));
console.log(`Filtered out ${initialCount - translations.length} unsafe generic translations.`);

// 2. Define highly precise, component-scoped safe translations
const safeReplacements = [
  // Error UI
  {
    "old": 'label:"Error",textColor:"text-red-500"',
    "new": 'label:"错误",textColor:"text-red-500"'
  },
  {
    "old": 'className:"mb-2 text-sm font-medium text-foreground",children:"Error"',
    "new": 'className:"mb-2 text-sm font-medium text-foreground",children:"错误"'
  },
  // Prompt UI
  {
    "old": 'className:"text-muted-foreground text-sm mb-0.5",children:"Prompt"',
    "new": 'className:"text-muted-foreground text-sm mb-0.5",children:"系统提示词"'
  },
  {
    "old": 'className:"text-sm text-muted-foreground px-3 select-none",children:"Prompt"',
    "new": 'className:"text-sm text-muted-foreground px-3 select-none",children:"系统提示词"'
  },
  {
    "old": 'className:"text-sm font-medium text-left",children:"Prompt"',
    "new": 'className:"text-sm font-medium text-left",children:"系统提示词"'
  },
  {
    "old": 'className:"mb-1 text-xs font-medium text-foreground",children:"Prompt"',
    "new": 'className:"mb-1 text-xs font-medium text-foreground",children:"系统提示词"'
  },
  {
    "old": 'bg-background border-border text-muted-foreground hover:bg-secondary"),children:"Prompt"',
    "new": 'bg-background border-border text-muted-foreground hover:bg-secondary"),children:"系统提示词"'
  }
];

// Append the new safe rules
translations.push(...safeReplacements);
console.log(`Appended ${safeReplacements.length} safe high-precision translations.`);

// Write back
fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf8');
console.log(`Successfully saved cleaned translations dictionary. Total entries: ${translations.length}`);
