'use client'

import { useState } from 'react'

interface URLInputProps {
  onFetchData: (url: string) => void
  loading: boolean
}

export default function URLInput({ onFetchData, loading }: URLInputProps) {
  const [inputValue, setInputValue] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFetchData(inputValue)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          placeholder="Paste your JSON URL here (e.g., https://api.example.com/data)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
          className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="whitespace-nowrap rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>
    </form>
  )
}
