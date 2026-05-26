import fs from 'fs';
import path from 'path';

const backupPath = 'C:\\Users\\i-cgh\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\jetskiAgent\\main.js.bak';
const translationsPath = path.join(process.cwd(), 'translations.json');

if (!fs.existsSync(backupPath)) {
  console.error('Backup file not found at ' + backupPath);
  process.exit(1);
}

const content = fs.readFileSync(backupPath, 'utf8');
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

// List of all old string keys in translations to check coverage
const translatedOldKeys = translations.map(t => t.old);

// Regular expressions to find string literals
// Note: We need to handle double quotes, single quotes, and template literals.
// Since the file is 12MB, we will process chunk by chunk or match globally.
console.log('Finding string literals...');

const doubleQuoteRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
const singleQuoteRegex = /'([^'\\]*(?:\\.[^'\\]*)*)'/g;
const templateLiteralRegex = /`([^`\\]*(?:\\.[^`\\]*)*)`/g;

const candidates = new Set();
const candidateDetails = [];

function addCandidate(str, raw, type, pos) {
  const trimmed = str.trim();
  if (trimmed.length < 2) return;
  
  // Must contain English letters
  if (trimmed.search(/[a-zA-Z]/) === -1) return;
  
  // Must have at least one word character sequence of length >= 2
  if (!/[a-zA-Z]{2,}/.test(trimmed)) return;
  
  // Filter out URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('file://')) return;
  
  // Filter out base64 or long hex strings
  if (trimmed.length > 100 && !trimmed.includes(' ')) return;
  if (/^[a-zA-Z0-9+/=]{40,}$/.test(trimmed)) return;
  
  // Filter out file paths or typical configuration keys (camelCase or kebab-case or snake_case with no spaces)
  if (!trimmed.includes(' ') && !trimmed.includes('-') && !trimmed.includes('_') && trimmed.length > 15) return;
  
  // Filter out simple CSS classes or class lists like "flex flex-col items-center..."
  const words = trimmed.split(/\s+/);
  const isClassList = words.every(w => {
    return /^[a-z0-9\-\[\]#:\/]+$/.test(w) || w.startsWith('hover:') || w.startsWith('focus:') || w.startsWith('dark:') || w.startsWith('bg-') || w.startsWith('text-') || w.startsWith('p-') || w.startsWith('m-');
  });
  if (isClassList && words.length > 1 && trimmed.includes('-')) return;
  if (trimmed.startsWith('.') || trimmed.startsWith('#')) return; // CSS selectors
  
  // Filter out common code constants/keywords or CSS class singletons
  const commonCodes = new Set([
    'flex', 'grid', 'hidden', 'block', 'inline', 'static', 'absolute', 'relative', 'fixed',
    'none', 'auto', 'inherit', 'initial', 'unset', 'normal', 'bold', 'italic', 'underline',
    'warning', 'error', 'info', 'success', 'primary', 'secondary', 'muted', 'accent',
    'true', 'false', 'null', 'undefined', 'object', 'function', 'string', 'number', 'boolean',
    'class', 'const', 'let', 'var', 'import', 'export', 'default', 'return', 'switch', 'case',
    'width', 'height', 'top', 'bottom', 'left', 'right', 'color', 'background', 'border',
    'padding', 'margin', 'font', 'text', 'align', 'justify', 'items', 'content', 'shadow',
    'rounded', 'opacity', 'transition', 'duration', 'delay', 'ease', 'animate', 'spin',
    'click', 'hover', 'focus', 'active', 'disabled', 'checked', 'selected', 'open', 'close',
    'json', 'xml', 'html', 'css', 'javascript', 'typescript', 'node', 'npm', 'yarn', 'pnpm',
    'git', 'github', 'gitlab', 'bitbucket', 'vscode', 'chrome', 'firefox', 'safari', 'edge',
    'utf-8', 'utf8', 'ascii', 'base64', 'hex', 'binary', 'stream', 'buffer', 'array',
    'username', 'password', 'email', 'token', 'auth', 'login', 'logout', 'signin', 'signout',
    'signup', 'register', 'submit', 'cancel', 'save', 'delete', 'remove', 'add', 'edit',
    'update', 'create', 'read', 'write', 'view', 'search', 'filter', 'sort', 'page', 'limit',
    'offset', 'query', 'params', 'body', 'headers', 'response', 'request', 'status', 'code',
    'message', 'error_description', 'error_uri', 'access_token', 'refresh_token', 'token_type',
    'expires_in', 'scope', 'state', 'nonce', 'client_id', 'client_secret', 'redirect_uri',
    'grant_type', 'code_verifier', 'code_challenge', 'code_challenge_method', 'user', 'admin',
    'guest', 'member', 'owner', 'editor', 'viewer', 'role', 'permission', 'grant', 'revoke',
    'allow', 'deny', 'block', 'trust', 'distrust', 'verify', 'confirm', 'approve', 'reject',
    'pending', 'approved', 'rejected', 'canceled', 'completed', 'failed', 'progress',
    'loading', 'loaded', 'waiting', 'idle', 'running', 'stopped', 'paused', 'resumed',
    'started', 'ended', 'finished', 'expired', 'invalid', 'valid', 'active', 'inactive',
    'enabled', 'disabled', 'visible', 'hidden', 'collapsed', 'expanded', 'minimized',
    'maximized', 'pinned', 'unpinned', 'locked', 'unlocked', 'secured', 'unsecured',
    'safe', 'unsafe', 'trusted', 'untrusted', 'allowed', 'denied', 'blocked', 'required',
    'optional', 'recommended', 'mandatory', 'conditional', 'custom', 'default', 'standard',
    'basic', 'advanced', 'expert', 'pro', 'premium', 'enterprise', 'ultimate', 'free',
    'trial', 'beta', 'alpha', 'rc', 'stable', 'lts', 'latest', 'old', 'new', 'next',
    'prev', 'previous', 'first', 'last', 'index', 'key', 'value', 'type', 'name', 'title',
    'description', 'label', 'icon', 'image', 'video', 'audio', 'file', 'folder', 'directory',
    'path', 'url', 'uri', 'link', 'href', 'src', 'alt', 'target', 'rel', 'download',
    'upload', 'import', 'export', 'backup', 'restore', 'sync', 'async', 'promise',
    'resolve', 'reject', 'then', 'catch', 'finally', 'try', 'throw', 'error', 'exception',
    'debug', 'trace', 'info', 'warn', 'warning', 'error', 'fatal', 'log', 'logger',
    'console', 'window', 'document', 'body', 'head', 'meta', 'script', 'style', 'link',
    'div', 'span', 'p', 'a', 'button', 'input', 'select', 'option', 'textarea', 'form',
    'label', 'img', 'svg', 'path', 'g', 'rect', 'circle', 'line', 'polyline', 'polygon',
    'text', 'tspan', 'foreignObject', 'canvas', 'iframe', 'audio', 'video', 'source',
    'track', 'embed', 'object', 'param', 'picture', 'source', 'map', 'area', 'table',
    'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'col', 'colgroup', 'caption', 'ul',
    'ol', 'li', 'dl', 'dt', 'dd', 'menu', 'dialog', 'details', 'summary', 'template',
    'slot', 'shadow-root', 'shadowRoot', 'shadow_root', 'slot-name', 'slotName',
    'classname', 'className', 'class_name', 'id', 'name', 'type', 'value', 'placeholder',
    'disabled', 'required', 'readonly', 'multiple', 'checked', 'selected', 'autofocus',
    'autocomplete', 'autocorrect', 'autocapitalize', 'spellcheck', 'novalidate', 'formaction',
    'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'accept', 'alt', 'src',
    'srclang', 'default', 'kind', 'label', 'sizes', 'srcset', 'crossorigin', 'integrity',
    'referrerpolicy', 'async', 'defer', 'charset', 'content', 'http-equiv', 'name', 'scheme',
    'property', 'itemprop', 'itemscope', 'itemtype', 'itemid', 'itemref', 'lang', 'dir',
    'translate', 'xml:lang', 'tabindex', 'accesskey', 'contenteditable', 'contextmenu',
    'draggable', 'dropzone', 'hidden', 'spellcheck', 'title', 'role', 'aria-', 'data-',
    'event', 'action', 'method', 'target', 'enctype', 'accept-charset', 'novalidate',
    'autocomplete', 'name', 'value', 'type', 'placeholder', 'disabled', 'readonly',
    'required', 'multiple', 'checked', 'selected', 'size', 'maxlength', 'minlength',
    'pattern', 'min', 'max', 'step', 'list', 'autofocus', 'autocomplete', 'dirname',
    'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget',
    'height', 'width', 'src', 'alt', 'usemap', 'ismap', 'shape', 'coords', 'href',
    'target', 'download', 'rel', 'rev', 'hreflang', 'type', 'media', 'sizes', 'srcset',
    'useAICredits', 'availableCredits', 'minimumCreditAmountForUsage', 'modelCredits',
    'auth-status', 'validatingLogin', 'loginError', 'signedIn', 'signedOut', 'uninitialized',
    'projectPicker', 'here', 'warning', 'utm_source', 'utm_medium', 'utm_campaign',
    'See Activity', 'Get More AI Credits', 'Recording...', 'Recording', 'recording',
    'Already recording', 'No active recording', 'terminal-voice', 'recording-badge',
    'monaco-count-badge', 'long', 'disabled', 'audioContext', 'analyser', 'dataArray',
    'bufferLength', 'mediaStream', 'mediaRecorder', 'onstop', 'voiceRecordingStarted',
    'voiceRecordingStopped', 'terminal', 'terminal-voice', 'terminal-voice recording',
    'microphone', 'voice', 'speech', 'speech-to-text', 'speechToText', 'transcription',
    'Google Chrome', 'chrome', 'chromium', 'headless', 'puppeteer', 'playwright',
    'selenium', 'webdriver', 'browser', 'page', 'context', 'frame', 'element', 'selector',
    'xpath', 'css', 'text', 'id', 'name', 'class', 'tag', 'attribute', 'property',
    'value', 'content', 'innerHtml', 'innerText', 'textContent', 'outerHtml', 'outerText',
    'title', 'description', 'label', 'placeholder', 'tooltip', 'popover', 'modal',
    'dialog', 'alert', 'toast', 'notification', 'badge', 'chip', 'tag', 'avatar',
    'icon', 'svg', 'path', 'g', 'rect', 'circle', 'line', 'polyline', 'polygon',
    'useAICreditsSentinelKey', 'availableCreditsSentinelKey', 'minimumCreditAmountForUsageKey',
    'uss-modelCredits', 'uss-agentPreferences', 'uss-browserPreferences', 'uss-editorPreferences',
    'uss-oauth', 'uss-userStatus', 'uss-overrideStore', 'uss-enterprisePreferences',
    'uss-systemInfos', 'uss-fileIconTheme', 'fileIconThemeSentinelKey', 'machine-infos'
  ]);

  if (commonCodes.has(trimmed) || commonCodes.has(trimmed.toLowerCase())) return;
  
  // Filter out pure symbols/numbers
  if (/^[0-9\s_\-\.\:\,\;\!\?\@\#\$\%\^\&\*\(\)\+\[\]\{\}\<\>\/\\\|]+$/.test(trimmed)) return;

  // Check if it's already translated/covered in translations.json
  // Let's do a substring search or exact match
  const isTranslated = translatedOldKeys.some(key => {
    return key.includes(trimmed) || trimmed.includes(key);
  });
  if (isTranslated) return;

  if (!candidates.has(trimmed)) {
    candidates.add(trimmed);
    candidateDetails.push({ trimmed, raw, type, pos });
  }
}

// 1. Scan Double Quote Strings
let match;
while ((match = doubleQuoteRegex.exec(content)) !== null) {
  addCandidate(match[1], match[0], 'double', match.index);
}

// 2. Scan Single Quote Strings
while ((match = singleQuoteRegex.exec(content)) !== null) {
  addCandidate(match[1], match[0], 'single', match.index);
}

// 3. Scan Template Literal Strings
while ((match = templateLiteralRegex.exec(content)) !== null) {
  addCandidate(match[1], match[0], 'template', match.index);
}

// Sort candidates by length (longer first, to prioritize compound UI strings)
candidateDetails.sort((a, b) => b.trimmed.length - a.trimmed.length);

const results = [];
candidateDetails.forEach(c => {
  // Let's print context for verification
  const start = Math.max(0, c.pos - 80);
  const end = Math.min(content.length, c.pos + c.raw.length + 80);
  const context = content.substring(start, end).replace(/\r?\n/g, ' ');
  results.push({
    string: c.trimmed,
    raw: c.raw,
    type: c.type,
    context: context,
    pos: c.pos
  });
});

console.log(`Found ${results.length} unique candidates.`);

fs.writeFileSync('scratch/candidate_english_strings.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Results saved to scratch/candidate_english_strings.json');

// Print first 50 long candidates
console.log('\n=== Top 50 candidates ===');
results.slice(0, 50).forEach((c, i) => {
  console.log(`${i+1}. [${c.string}]`);
  console.log(`   Context: ${c.context}\n`);
});
