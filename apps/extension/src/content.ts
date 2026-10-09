import type { PlasmoCSConfig } from "plasmo"
import { extractDOM } from "extractor"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "EXTRACT_UI") {
    try {
      const domData = extractDOM(document.body)
      sendResponse({ success: true, uiKey: JSON.stringify(domData, null, 2) })
    } catch (e) {
      sendResponse({ success: false, uiKey: String(e) })
    }
  }
})
