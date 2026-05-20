import * as i18nt from '@xiaode-ai/i18nt';
console.log('--- i18nt Exports ---');
console.log(Object.keys(i18nt));

try {
  const plugins = await import('@xiaode-ai/i18nt/plugins');
  console.log('--- plugins Exports ---');
  console.log(Object.keys(plugins));
} catch(e) {
  console.log('No /plugins subpath or error:', e.message);
}
