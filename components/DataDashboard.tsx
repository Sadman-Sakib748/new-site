'use client'

import { useMemo } from 'react'
import DataTable from './DataTable'
import DataCards from './DataCards'
import JSONViewer from './JSONViewer'

interface DataDashboardProps {
  data: any
}

type DataType = 'array' | 'object' | 'mixed' | 'unknown'

function detectDataType(data: any): DataType {
  if (Array.isArray(data)) {
    return 'array'
  }
  if (data && typeof data === 'object') {
    // Check if object contains arrays at top level (mixed data)
    const values = Object.values(data)
    if (values.some((v) => Array.isArray(v))) {
      return 'mixed'
    }
    return 'object'
  }
  return 'unknown'
}

export default function DataDashboard({ data }: DataDashboardProps) {
  const dataType = useMemo(() => detectDataType(data), [data])

  const renderContent = () => {
    switch (dataType) {
      case 'array':
        return (
          <div className="space-y-6">
            {Array.isArray(data) && data.length > 0 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Records ({data.length})
                  </h2>
                  <DataTable data={data} />
                </div>
              </>
            )}
            {Array.isArray(data) && data.length === 0 && (
              <div className="rounded-lg border border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">No data to display</p>
              </div>
            )}
          </div>
        )

      case 'object':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Data</h2>
              <DataCards data={data} />
            </div>
          </div>
        )

      case 'mixed':
        return (
          <div className="space-y-6">
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>
                <h2 className="text-lg font-semibold text-foreground mb-4 capitalize">
                  {key} {Array.isArray(value) ? `(${value.length})` : ''}
                </h2>
                {Array.isArray(value) && value.length > 0 && (
                  <DataTable data={value} />
                )}
                {!Array.isArray(value) && (
                  <DataCards data={value} />
                )}
                {Array.isArray(value) && value.length === 0 && (
                  <div className="rounded-lg border border-border bg-card p-4 text-center">
                    <p className="text-sm text-muted-foreground">No {key} to display</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="rounded-lg border border-border bg-card p-8">
            <p className="text-muted-foreground">Unable to visualize this data format</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      {renderContent()}

      <div className="mt-8 border-t border-border pt-8">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Raw JSON Data
        </h3>
        <JSONViewer data={data} />
      </div>
    </div>
  )
}
