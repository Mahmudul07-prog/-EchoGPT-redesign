import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json' with { type: 'json' }

export default defineManifest({
  manifest_version: 3,
  name: 'EchoGPT — Multi-AI Chat Sidebar',
  short_name: 'EchoGPT',
  version: pkg.version,
  description:
    'Chat with multiple AI models from any tab, summarize pages, and explain selected text — redesign concept.',
  icons: {
    16: 'public/icons/icon16.png',
    32: 'public/icons/icon32.png',
    48: 'public/icons/icon48.png',
    128: 'public/icons/icon128.png',
  },
  action: {
    default_icon: {
      16: 'public/icons/icon16.png',
      32: 'public/icons/icon32.png',
      48: 'public/icons/icon48.png',
    },
    default_popup: 'popup.html',
  },
  side_panel: {
    default_path: 'sidepanel.html',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/content/index.ts'],
      run_at: 'document_idle',
    },
  ],
  permissions: ['storage', 'sidePanel', 'contextMenus', 'activeTab', 'scripting'],
  host_permissions: ['http://*/*', 'https://*/*'],
  commands: {
    'toggle-panel': {
      suggested_key: {
        default: 'Ctrl+Shift+E',
        mac: 'Command+Shift+E',
      },
      description: 'Open the EchoGPT side panel',
    },
  },
})
