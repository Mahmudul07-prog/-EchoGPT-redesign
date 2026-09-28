/**
 * Running `npm run dev` opens these pages as plain web pages (not a loaded extension),
 * which makes chrome.* undefined. `isExtensionEnv` lets every chrome.* call site fall
 * back to an in-memory/localStorage mock so the UI is fully previewable in a normal
 * browser tab during development. Real behavior only kicks in once loaded unpacked.
 */
export const isExtensionEnv =
  typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id
