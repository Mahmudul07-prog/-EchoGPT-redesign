// Lightweight content script: exposes the current page's readable text so the side
// panel's "Summarize this page" quick action has something to summarize. It only runs
// when asked (message-based), it never injects UI into the host page.

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'echogpt/get-page-context') return undefined

  const title = document.title
  const text = document.body?.innerText?.trim().slice(0, 8000) ?? ''
  sendResponse({ title, url: location.href, text })
  return true
})
