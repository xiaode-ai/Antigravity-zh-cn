import assert from 'assert';
import { syncDomInjectionTranslation } from '../src/dom_injector.js';

console.log('--- Running Validation Unit Tests ---');

// Test Case 1: Valid dictionary escaping (exactly 1 backslash: \")
try {
  const translations = [
    {
      old: 'void win.loadURL(url);',
      new: 'win.webContents.on(\'dom-ready\', () => {\n  win.webContents.executeJavaScript("(() => {\\n    const dictionary = {\\"Key\\":\\"Value\\"};\\n    translateTextNode; MutationObserver;\\n  })()");\n});\nvoid win.loadURL(url);'
    }
  ];
  syncDomInjectionTranslation(translations);
  console.log('✅ Test 1 (Valid Escaping) Passed!');
} catch (e) {
  console.error('❌ Test 1 Failed:', e.message);
  process.exit(1);
}

// Test Case 2: Invalid escaping (multiple backslashes: \\\" or more)
try {
  const translations = [
    {
      old: 'void win.loadURL(url);',
      new: 'win.webContents.on(\'dom-ready\', () => {\n  win.webContents.executeJavaScript("(() => {\\n    const dictionary = {\\\\\\"Key\\\\\\\":\\\\\\"Value\\\\\\\"};\\n    translateTextNode; MutationObserver;\\n  })()");\n});\nvoid win.loadURL(url);'
    }
  ];
  syncDomInjectionTranslation(translations);
  console.error('❌ Test 2 Failed: Did not throw error on invalid escaping!');
  process.exit(1);
} catch (e) {
  if (e.message.includes('检测到非法的转义反斜杠数量')) {
    console.log('✅ Test 2 (Invalid Escaping) Passed!');
  } else {
    console.error('❌ Test 2 Failed with unexpected error:', e.message);
    process.exit(1);
  }
}

console.log('--- All Unit Tests Passed! ---');
