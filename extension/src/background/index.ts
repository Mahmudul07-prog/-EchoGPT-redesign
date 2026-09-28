chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'echogpt-explain-selection',
    title: 'Explain with EchoGPT',
    contexts: ['selection'],
  })
  chrome.contextMenus.create({
    id: 'echogpt-summarize-page',
    title: 'Summarize this page with EchoGPT',
    contexts: ['page'],
  })
})

// NOTE: action.onClicked never fires while manifest.action.default_popup is set —
// the toolbar click opens popup.html instead, and the popup itself opens the side
// panel (via chrome.sidePanel.open, which needs a direct user-gesture call site).

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.windowId) return
  await chrome.sidePanel.open({ windowId: tab.windowId })

  if (info.menuItemId === 'echogpt-explain-selection') {
    await chrome.storage.local.set({
      echogpt_pending_action: { type: 'explain', text: info.selectionText ?? '' },
    })
  }
  if (info.menuItemId === 'echogpt-summarize-page') {
    await chrome.storage.local.set({
      echogpt_pending_action: { type: 'summarize-page', url: info.pageUrl ?? '' },
    })
  }
})

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-panel') return
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.windowId) void chrome.sidePanel.open({ windowId: tab.windowId })
})
