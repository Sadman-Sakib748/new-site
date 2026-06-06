'use client'

import { useMemo, useState } from 'react'

interface DataTableProps {
  data: any[]
}

export default function DataTable({ data }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  const columns = useMemo(() => {
    if (!data || data.length === 0) return []
    const firstItem = data[0]
    return Object.keys(firstItem).slice(0, 10) // Limit to 10 columns
  }, [data])

  const sortedData = useMemo(() => {
    let sortableData = [...data]
    if (sortConfig) {
      sortableData.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]

        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }

        return sortConfig.direction === 'asc'
          ? aVal - bVal
          : bVal - aVal
      })
    }
    return sortableData
  }, [data, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { key, direction: 'asc' }
    })
  }

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') return JSON.stringify(value)
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...'
    }
    return String(value)
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full">
        <thead className="border-b border-border bg-secondary/30">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                className="px-4 py-3 text-left text-sm font-semibold text-foreground cursor-pointer hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {col}
                  {sortConfig?.key === col && (
                    <span className="text-xs text-accent">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.slice(0, 100).map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-border hover:bg-secondary/20 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={`${idx}-${col}`}
                  className="px-4 py-3 text-sm text-foreground"
                >
                  <div className="truncate max-w-xs" title={formatValue(row[col])}>
                    {formatValue(row[col])}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length > 100 && (
        <div className="border-t border-border bg-secondary/20 px-4 py-3 text-center text-sm text-muted-foreground">
          Showing 100 of {sortedData.length} records
        </div>
      )}
    </div>
  )
}
