'use client'

import { useState } from 'react'

interface JSONViewerProps {
  data: any
}

export default function JSONViewer({ data }: JSONViewerProps) {
  const [copied, setCopied] = useState(false)

  const jsonString = JSON.stringify(data, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {jsonString.length} characters
        </p>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 rounded bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
        >
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>
      <div className="rounded-lg border border-border bg-secondary/30 p-4 overflow-auto max-h-96">
        <pre className="text-xs text-foreground font-mono whitespace-pre-wrap break-words">
          {jsonString}
        </pre>
      </div>
    </div>
  )
}
