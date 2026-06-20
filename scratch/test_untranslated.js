import fs from 'fs';

// Mock DOM globals for Node environment
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

const translations = JSON.parse(fs.readFileSync('translations.json', 'utf8'));
const entry = translations.find(t => t.old === 'void win.loadURL(url);');
if (!entry) {
  console.error('entry not found');
  process.exit(1);
}

const match = entry.new.match(/executeJavaScript\("([\s\S]*?)"\)/);
if (!match) {
  console.error('executeJavaScript not found');
  process.exit(1);
}

let rawJS = match[1]
  .replace(/\\"/g, '"')
  .replace(/\\'/g, "'")
  .replace(/\\\\/g, '\\')
  .replace(/\\n/g, '\n');

const iifeBodyMatch = rawJS.match(/\(\(\) => \{([\s\S]*)\}\)\(\)/);
const iifeBody = iifeBodyMatch[1] + '\nreturn { translateText, isInsideInputOrEditable };';
const { translateText, isInsideInputOrEditable } = new Function(iifeBody)();

console.log('--- Test isInsideInputOrEditable ---');

// Test Case A: Inside a standard text input (should return true)
const inputNode = {
  nodeType: 3,
  parentElement: {
    tagName: 'INPUT',
    childNodes: [],
    getAttribute: (attr) => attr === 'type' ? 'text' : null,
    hasAttribute: () => false
  }
};
console.log('Inside INPUT element:', isInsideInputOrEditable(inputNode));

// Test Case B: Inside find-widget overlay of Monaco Editor (should return false)
const findWidgetNode = {
  nodeType: 3,
  parentElement: {
    tagName: 'DIV',
    childNodes: [],
    getAttribute: (attr) => attr === 'class' ? 'find-widget' : null,
    hasAttribute: () => false,
    parentElement: {
      tagName: 'DIV',
      childNodes: [],
      getAttribute: (attr) => attr === 'class' ? 'monaco-editor' : null,
      hasAttribute: () => false
    }
  }
};
console.log('Inside Monaco find-widget overlay:', isInsideInputOrEditable(findWidgetNode));

// Test Case C: Inside search pane workbench list (should return false)
const listNode = {
  nodeType: 3,
  parentElement: {
    tagName: 'DIV',
    childNodes: [],
    getAttribute: (attr) => attr === 'class' ? 'monaco-list' : null,
    hasAttribute: () => false,
    parentElement: {
      tagName: 'DIV',
      childNodes: [],
      getAttribute: (attr) => attr === 'class' ? 'monaco-workbench' : null,
      hasAttribute: () => false
    }
  }
};
console.log('Inside Monaco workbench list container:', isInsideInputOrEditable(listNode));

// Test Case D: Inside editable monaco code lines (should return true)
const editableMonacoNode = {
  nodeType: 3,
  parentElement: {
    tagName: 'SPAN',
    childNodes: [],
    getAttribute: (attr) => attr === 'class' ? 'mtk1' : null,
    hasAttribute: () => false,
    parentElement: {
      tagName: 'DIV',
      childNodes: [],
      getAttribute: (attr) => attr === 'class' ? 'view-line' : null,
      hasAttribute: () => false,
      parentElement: {
        tagName: 'DIV',
        childNodes: [],
        getAttribute: (attr) => attr === 'class' ? 'monaco-editor' : null,
        hasAttribute: () => false
      }
    }
  }
};
console.log('Inside Monaco editable view-line area:', isInsideInputOrEditable(editableMonacoNode));

console.log('\n--- Test Translations ---');
const testCases = [
  { input: 'View Stacked Diff', node: findWidgetNode, expected: '查看堆叠对比' },
  { input: 'Find', node: findWidgetNode, expected: '查找' },
  { input: 'Match case', node: findWidgetNode, expected: '区分大小写' },
  { input: 'Use regular expression', node: findWidgetNode, expected: '使用正则表达式' },
  { input: 'No results', node: findWidgetNode, expected: '无结果' },
  { input: 'Close (Escape)', node: findWidgetNode, expected: '关闭 (Escape)' },
  { input: 'Cancel All Tasks', node: findWidgetNode, expected: '取消所有任务' },
  { input: 'Explored 1 search', node: listNode, expected: '探索了 1 次搜索' },
  { input: 'Show 19 more...', node: listNode, expected: '显示另外 19 项...' },
  { input: 'Find', node: editableMonacoNode, expected: 'Find' } // Should not translate editable monaco code
];

for (const tc of testCases) {
  const result = translateText(tc.input, tc.node);
  console.log(`"${tc.input}" -> "${result}" (Expected: "${tc.expected}")`);
  if (result !== tc.expected) {
    console.error(`❌ Mismatch for "${tc.input}"!`);
    process.exit(1);
  }
}

console.log('\n✅ All Diagnostics & Tests Passed!');
