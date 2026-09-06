import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  publicDir: 'extension-public',
  outDir: '.output',
  manifest: {
    name: 'A11y Interaction Trace',
    short_name: 'A11y Trace',
    description: 'Record keyboard actions, focus changes, nearby control snapshots, and optional screenshots locally.',
    version: '1.0.0',
    permissions: ['activeTab', 'storage', 'downloads', 'scripting'],
    action: { default_title: 'A11y Interaction Trace — record keyboard focus bugs' },
    icons: {
      16: '/icon/16.png',
      32: '/icon/32.png',
      48: '/icon/48.png',
      128: '/icon/128.png'
    }
  },
  zip: { name: 'a11y-interaction-trace' }
});
