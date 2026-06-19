import assert from 'assert';
import fs from 'fs';
import { syncDomInjectionTranslation } from '../src/dom_injector.js';

console.log('--- Running Validation Unit Tests ---');

// Mock DOM globals for Node environment to prevent execution crashes during evaluation
global.document = {
  body: {},
  documentElement: {
    addEventListener: () => {}
  },
  readyState: 'complete',
  addEventListener: () => {},
  createTreeWalker: () => ({
    nextNode: () => null
  })
};
global.Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3
};
global.NodeFilter = {
  SHOW_TEXT: 1
};
global.MutationObserver = class {
  observe() {}
  disconnect() {}
};


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

// Test Case 3: Invalid style modification (should throw style error)
try {
  const translations = [
    {
      old: 'void win.loadURL(url);',
      new: 'win.webContents.on(\'dom-ready\', () => {\n  win.webContents.executeJavaScript("(() => {\\n    const dictionary = {\\"Key\\":\\"Value\\"};\\n    translateTextNode; MutationObserver;\\n    node.parentElement.style.whiteSpace = \'nowrap\';\\n  })()");\n});\nvoid win.loadURL(url);'
    }
  ];
  syncDomInjectionTranslation(translations);
  console.error('❌ Test 3 Failed: Did not throw error on style modification!');
  process.exit(1);
} catch (e) {
  if (e.message.includes('检测到汉化注入脚本中包含修改 DOM 元素样式的逻辑')) {
    console.log('✅ Test 3 (Style Modification Detection) Passed!');
  } else {
    console.error('❌ Test 3 Failed with unexpected error:', e.message);
    process.exit(1);
  }
}

// Test Case 4: Priority translation logic verification
try {
  const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
  const entry = translations.find(t => t.old === 'void win.loadURL(url);');
  assert(entry, 'DOM injection entry not found');

  // Extract the IIFE code inside executeJavaScript
  const match = entry.new.match(/executeJavaScript\("([\s\S]*?)"\)/);
  assert(match, 'executeJavaScript code not found');

  let rawJS = match[1]
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n');

  // Extract IIFE body and append a return statement
  const iifeBodyMatch = rawJS.match(/\(\(\) => \{([\s\S]*)\}\)\(\)/);
  assert(iifeBodyMatch, 'IIFE body not found');
  const iifeBody = iifeBodyMatch[1] + '\nreturn translateText;';

  const translateFn = new Function(iifeBody)();

  // Run test cases on translateFn
  const testCases = [
    { input: 'Back', expected: '返回' },
    { input: '6 days, 23 hours.', expected: '6 天，23 小时。' },
    { input: '4 hours, 53 minutes.', expected: '4 小时，53 分钟。' },
    { input: '1 day, 10 hours.', expected: '1 天，10 小时。' },
    { input: '1 day, 10 hours. If on a supported paid plan, you can use AI credits in the interim or upgrade to a higher tier.', expected: '1 天，10 小时。如果您使用的是受支持的付费方案，在此期间可以使用 AI 点数，或者升级到更高等级。' },
    { input: 'Inherits from global settings.', expected: '继承自全局设置。' },
    { input: 'Inherits from global settings. Local permissions have higher priority. Learn more.', expected: '继承自全局设置。本地权限具有更高优先级。了解更多。' },
    { input: ' active conversations ', expected: '个活跃对话' },
    { input: ' archived conversations.', expected: '个已归档对话.' }
  ];

  for (const tc of testCases) {
    const actual = translateFn(tc.input, { nodeType: 3 });
    assert.strictEqual(actual.trim(), tc.expected.trim(), `Failed for input: "${tc.input}"\nExpected: "${tc.expected}"\nActual:   "${actual}"`);
  }

  // Verify Inherits from global settings variations
  const testSetting1 = translateFn('Inherits from global Settings.', { nodeType: 3 });
  assert.strictEqual(testSetting1.trim(), '继承自全局设置。', 'Should translate Inherits from global Settings. correctly');

  const testSetting2 = translateFn('Inherits From Global Settings', { nodeType: 3 });
  assert.strictEqual(testSetting2.trim(), '继承自全局设置。', 'Should translate Inherits From Global Settings correctly');

  // Verify that elements within chat bubbles/messages are NOT translated
  const chatNodeMock = {
    nodeType: 3,
    parentElement: {
      className: 'chat-message-bubble-content assistant-message',
      tagName: 'DIV',
      getAttribute: (attr) => attr === 'class' ? 'chat-message-bubble-content assistant-message' : null,
      hasAttribute: (attr) => false
    }
  };
  const actualChat = translateFn('Back', chatNodeMock);
  assert.strictEqual(actualChat, 'Back', 'Should bypass translation inside assistant chat messages');

  const chatNodeMock2 = {
    nodeType: 3,
    parentElement: {
      className: 'user-chat-bubble',
      tagName: 'DIV',
      getAttribute: (attr) => attr === 'class' ? 'user-chat-bubble' : null,
      hasAttribute: (attr) => false
    }
  };
  const actualChat2 = translateFn('6 days, 23 hours.', chatNodeMock2);
  assert.strictEqual(actualChat2, '6 days, 23 hours.', 'Should bypass translation inside user chat messages');

  // Verify Monaco Editor / Input box bypass
  const editorMockNode = {
    nodeType: 3,
    parentElement: {
      tagName: 'SPAN',
      getAttribute: (attr) => attr === 'class' ? 'mtk1 monaco-mouse-cursor-text' : null,
      hasAttribute: (attr) => false,
      parentElement: {
        tagName: 'DIV',
        getAttribute: (attr) => attr === 'class' ? 'view-line monaco-editor-line' : null,
        hasAttribute: (attr) => false,
        parentElement: {
          tagName: 'DIV',
          getAttribute: (attr) => attr === 'class' ? 'monaco-editor no-user-select' : null,
          hasAttribute: (attr) => false
        }
      }
    }
  };
  const actualEditorText = translateFn('Back', editorMockNode);
  assert.strictEqual(actualEditorText, 'Back', 'Should bypass translation inside monaco-editor');

  const inputClassMockNode = {
    nodeType: 3,
    parentElement: {
      tagName: 'SPAN',
      getAttribute: (attr) => attr === 'class' ? 'message-input-text-area' : null,
      hasAttribute: (attr) => false
    }
  };
  const actualInputClassText = translateFn('Back', inputClassMockNode);
  assert.strictEqual(actualInputClassText, 'Back', 'Should bypass translation inside wrapper with input class name');

  console.log('✅ Test 4 (Priority Translation Logic & Chat Bypass) Passed!');
} catch (e) {
  console.error('❌ Test 4 Failed:', e);
  process.exit(1);
}

console.log('--- All Unit Tests Passed! ---');
