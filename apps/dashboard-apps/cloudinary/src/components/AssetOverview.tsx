import {useEffect, useState} from 'react'

const API_BASE = import.meta.env.SANITY_APP_API_URL || 'http://localhost:3000'

interface AssetOverviewProps {
  config: {
    cloudName: string
    apiKey: string
    uploadPreset: string
  }
}

interface UsageData {
  storage: {used: number; limit: number}
  bandwidth: {used: number; limit: number}
  resources: number
  derived_resources: number
  plan: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function UsageGauge({label, used, limit}: {label: string; used: number; limit: number}) {
  const percent = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const barColor = percent > 80 ? 'bg-red-500' : percent > 60 ? 'bg-amber-500' : 'bg-cl-blue'

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500">
          {formatBytes(used)} / {formatBytes(limit)}
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{width: `${percent}%`}}
        />
      </div>
      <p className="m-0 mt-1 text-[11px] text-gray-400 text-right">
        {percent.toFixed(1)}% used
      </p>
    </div>
  )
}

export function AssetOverview({config}: AssetOverviewProps) {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [folders, setFolders] = useState<{name: string; path: string}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [configExpanded, setConfigExpanded] = useState(false)

  const consoleUrl = `https://console.cloudinary.com/console/${config.cloudName}/media_library`

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      fetch(`${API_BASE}/api/cloudinary?action=usage`).then((r) => r.json()),
      fetch(`${API_BASE}/api/cloudinary?action=tags`).then((r) => r.json()),
      fetch(`${API_BASE}/api/cloudinary?action=folders`).then((r) => r.json()),
    ])
      .then(([usageData, tagsData, foldersData]) => {
        setUsage(usageData)
        setTags(tagsData.tags || [])
        setFolders(foldersData.folders || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500">
        <div
          className="size-8 border-3 border-gray-200 border-t-cl-blue rounded-full"
          style={{animation: 'cl-spin 0.8s linear infinite'}}
        />
        <p className="m-0 text-sm">Loading account overview...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-cl-red m-0 mb-3">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Stats row */}
      {usage && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Assets" value={String(usage.resources)} />
          <StatCard label="Derived Assets" value={String(usage.derived_resources)} />
          <StatCard label="Plan" value={usage.plan} />
          <StatCard label="Folders" value={String(folders.length)} />
        </div>
      )}

      {/* Usage gauges */}
      {usage && (
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <h3 className="m-0 mb-4 text-base font-semibold text-gray-900">
            Usage
          </h3>
          <div className="flex flex-col gap-4">
            <UsageGauge
              label="Storage"
              used={usage.storage.used}
              limit={usage.storage.limit}
            />
            <UsageGauge
              label="Bandwidth (monthly)"
              used={usage.bandwidth.used}
              limit={usage.bandwidth.limit}
            />
          </div>
        </div>
      )}

      {/* Folders */}
      {folders.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <h3 className="m-0 mb-3 text-base font-semibold text-gray-900">
            Folders
          </h3>
          <div className="flex flex-wrap gap-2">
            {folders.map((f) => (
              <span
                key={f.path}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-700"
              >
                {f.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <h3 className="m-0 mb-3 text-base font-semibold text-gray-900">
            Tags ({tags.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 30).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
            {tags.length > 30 && (
              <span className="px-2.5 py-1 text-xs text-gray-400">
                +{tags.length - 30} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 className="m-0 mb-3 text-base font-semibold text-gray-900">
          Quick Links
        </h3>
        <div className="flex flex-col gap-2">
          <a
            href={consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-cl-blue no-underline text-sm font-medium transition-colors duration-150 hover:bg-gray-100 hover:border-gray-300"
          >
            <span className="text-base">&#x2197;</span>
            Open Cloudinary Console
          </a>
          <a
            href={`https://console.cloudinary.com/console/${config.cloudName}/settings/upload-presets`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-cl-blue no-underline text-sm font-medium transition-colors duration-150 hover:bg-gray-100 hover:border-gray-300"
          >
            <span className="text-base">&#x2699;</span>
            Upload Presets Settings
          </a>
        </div>
      </div>

      {/* Collapsible config info */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <button
          className="w-full px-5 py-4 flex items-center justify-between bg-transparent border-none cursor-pointer text-left"
          onClick={() => setConfigExpanded(!configExpanded)}
          type="button"
        >
          <h3 className="m-0 text-base font-semibold text-gray-900">
            Configuration
          </h3>
          <span className="text-gray-400 text-lg">
            {configExpanded ? '−' : '+'}
          </span>
        </button>
        {configExpanded && (
          <div className="px-5 pb-5 border-t border-gray-200 pt-4">
            <dl className="m-0 flex flex-col gap-2.5">
              <div className="flex gap-4 items-baseline">
                <dt className="text-sm text-gray-500 min-w-[120px] shrink-0">
                  Cloud Name
                </dt>
                <dd className="m-0 text-sm font-medium text-gray-700">
                  {config.cloudName}
                </dd>
              </div>
              <div className="flex gap-4 items-baseline">
                <dt className="text-sm text-gray-500 min-w-[120px] shrink-0">
                  API Key
                </dt>
                <dd className="m-0 text-sm font-medium text-gray-700">
                  {config.apiKey}
                </dd>
              </div>
              <div className="flex gap-4 items-baseline">
                <dt className="text-sm text-gray-500 min-w-[120px] shrink-0">
                  Upload Preset
                </dt>
                <dd className="m-0 text-sm font-medium text-gray-700">
                  {config.uploadPreset || 'Not configured'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({label, value}: {label: string; value: string}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
      <p className="m-0 text-2xl font-bold text-gray-900">{value}</p>
      <p className="m-0 text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
