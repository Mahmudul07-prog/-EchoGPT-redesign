/**
 * On-demand helpers for pulling context out of the page the user is currently on. Both only do
 * anything when actually running as a loaded extension (isExtensionEnv) — in dev-preview mode
 * they resolve to undefined so callers can no-op gracefully.
 */
import { isExtensionEnv } from './chrome-shim'
import type { PageContext } from '../types'

async function getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

/** Asks the content script (already injected on http/https pages) for title/url/page text. */
export async function fetchPageContext(): Promise<PageContext | undefined> {
  if (!isExtensionEnv) return undefined
  try {
    const tab = await getActiveTab()
    if (tab?.id === undefined) return undefined
    const response = await chrome.tabs.sendMessage<{ type: string }, PageContext>(tab.id, {
      type: 'echogpt/get-page-context',
    })
    return response
  } catch {
    // No content script on this page (chrome://, the Web Store, a not-yet-loaded tab, etc).
    return undefined
  }
}

/** Reads the current text selection in the active tab, if any. */
export async function fetchSelectionText(): Promise<string> {
  if (!isExtensionEnv) return ''
  try {
    const tab = await getActiveTab()
    if (tab?.id === undefined) return ''
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() ?? '',
    })
    return injection?.result ?? ''
  } catch {
    return ''
  }
}
