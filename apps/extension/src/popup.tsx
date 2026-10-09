import { useState } from "react"
import "~style.css"

function IndexPopup() {
  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleExtract = async () => {
    setLoading(true)
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_UI" })
        if (response?.success) {
          const apiRes = await fetch("http://localhost:3000/api/ingest", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: response.uiKey
          })
          
          if (apiRes.ok) {
            const data = await apiRes.json()
            setKey(data.url)
          } else {
            setKey("error: API request failed")
          }
        } else {
          setKey("error: extraction failed")
        }
      }
    } catch (error) {
      console.error("Extraction error:", error)
      setKey("error: extraction failed")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (key) {
      navigator.clipboard.writeText(key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-w-64 plasmo-p-6 plasmo-bg-white plasmo-font-sans">
      <h1 className="plasmo-text-2xl plasmo-font-bold plasmo-mb-6 plasmo-text-slate-800">UIKey</h1>
      
      {!loading && !key && (
        <button
          onClick={handleExtract}
          className="plasmo-w-full plasmo-py-2.5 plasmo-px-4 plasmo-bg-blue-600 hover:plasmo-bg-blue-700 plasmo-text-white plasmo-font-medium plasmo-rounded-lg plasmo-transition-colors plasmo-shadow-sm"
        >
          Extract Current Site
        </button>
      )}

      {loading && (
        <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-3 plasmo-py-4">
          <div className="plasmo-w-8 plasmo-h-8 plasmo-border-4 plasmo-border-slate-100 plasmo-border-t-blue-600 plasmo-rounded-full plasmo-animate-spin"></div>
          <p className="plasmo-text-sm plasmo-text-slate-500 plasmo-font-medium">Extracting...</p>
        </div>
      )}

      {key && (
        <div className="plasmo-w-full plasmo-flex plasmo-flex-col plasmo-gap-4">
          <div className="plasmo-p-3 plasmo-bg-slate-50 plasmo-rounded-lg plasmo-border plasmo-border-slate-200">
            <p className="plasmo-text-center plasmo-font-mono plasmo-text-sm plasmo-text-slate-700">
              {key}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="plasmo-w-full plasmo-py-2.5 plasmo-px-4 plasmo-bg-slate-800 hover:plasmo-bg-slate-900 plasmo-text-white plasmo-font-medium plasmo-rounded-lg plasmo-transition-colors plasmo-shadow-sm"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
