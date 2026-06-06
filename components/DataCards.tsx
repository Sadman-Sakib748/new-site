'use client'

interface DataCardsProps {
  data: Record<string, any>
}

export default function DataCards({ data }: DataCardsProps) {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') return JSON.stringify(value)
    if (typeof value === 'string' && value.length > 200) {
      return value.substring(0, 200) + '...'
    }
    return String(value)
  }

  const entries = Object.entries(data).slice(0, 12)

  return (
    <div className="grid gap-4 sm:grid-cols-4 lg:grid-cols-3">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-lg border border-border bg-card p-4 hover:border-accent/50 transition-colors"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            {key}
          </p>
          <p className="text-sm text-foreground break-words line-clamp-3">
            {formatValue(value)}
          </p>
        </div>
      ))}
    </div>
  )
}
