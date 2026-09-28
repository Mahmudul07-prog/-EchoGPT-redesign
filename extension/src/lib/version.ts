import { isExtensionEnv } from './chrome-shim'

/** Falls back to the version in package.json (kept in sync manually) when previewing
 * popup.html/sidepanel.html as plain pages outside a loaded extension. */
const FALLBACK_VERSION = '1.0.0'

export function getAppVersion(): string {
  if (isExtensionEnv) {
    try {
      return chrome.runtime.getManifest().version
    } catch {
      return FALLBACK_VERSION
    }
  }
  return FALLBACK_VERSION
}
