import {useCallback, useRef, useState, useMemo} from 'react'
import {useCloudinaryAssets} from '../hooks/useCloudinaryAssets'
import type {CloudinaryProxyAsset} from '../types/cloudinary'

interface MediaLibraryBrowserProps {
  config: {
    cloudName: string
    apiKey: string
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaLibraryBrowser({config}: MediaLibraryBrowserProps) {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value)
    }, 400)
  }, [])

  const options = useMemo(
    () => (debouncedQuery ? {query: debouncedQuery} : {}),
    [debouncedQuery],
  )

  const {assets, isLoading, error, hasMore, loadMore, refresh} =
    useCloudinaryAssets(options)

  const thumbnailUrl = (asset: CloudinaryProxyAsset) => {
    if (asset.resource_type !== 'image') return null
    return `https://res.cloudinary.com/${config.cloudName}/image/upload/c_fill,w_300,h_200,f_auto,q_auto/${asset.public_id}.${asset.format}`
  }

  const copyUrl = async (asset: CloudinaryProxyAsset) => {
    try {
      await navigator.clipboard.writeText(asset.secure_url)
      setCopiedId(asset.public_id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Clipboard API may not be available in all contexts
    }
  }

  // Error state
  if (error && assets.length === 0) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-cl-red m-0 mb-3">{error}</p>
        <button
          className="px-4 py-2 bg-cl-blue text-white border-none rounded-lg text-sm/5 font-medium cursor-pointer hover:bg-cl-blue-dark"
          onClick={refresh}
          type="button"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-5">
      {/* Toolbar: search + refresh */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search assets..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm/5 bg-white text-gray-900 placeholder-gray-400 outline-hidden focus:border-cl-blue transition-colors duration-150"
          />
        </div>
        <button
          className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-500 cursor-pointer text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors duration-150"
          onClick={refresh}
          title="Refresh"
          type="button"
        >
          &#x21bb;
        </button>
      </div>

      {/* Asset count */}
      {assets.length > 0 && !isLoading && (
        <p className="m-0 text-xs text-gray-500">
          {assets.length} asset{assets.length !== 1 ? 's' : ''} loaded
          {hasMore ? ' (more available)' : ''}
        </p>
      )}

      {/* Loading — initial */}
      {isLoading && assets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500">
          <div
            className="size-8 border-3 border-gray-200 border-t-cl-blue rounded-full"
            style={{animation: 'cl-spin 0.8s linear infinite'}}
          />
          <p className="m-0 text-sm">Loading assets...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && assets.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="m-0 text-sm">
            {debouncedQuery
              ? 'No assets match your search'
              : 'No assets found in your Cloudinary account'}
          </p>
        </div>
      )}

      {/* Asset grid */}
      {assets.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {assets.map((asset) => {
            const thumb = thumbnailUrl(asset)
            const isCopied = copiedId === asset.public_id
            const displayName =
              asset.public_id.split('/').pop() || asset.public_id

            return (
              <button
                key={asset.public_id}
                className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer transition-all duration-150 hover:shadow-sm hover:border-gray-300 text-left p-0 relative"
                onClick={() => copyUrl(asset)}
                title={`Copy URL: ${asset.secure_url}`}
                type="button"
              >
                {/* Thumbnail */}
                {thumb ? (
                  <img
                    src={thumb}
                    alt={displayName}
                    className="w-full h-[140px] object-cover block bg-gray-100"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-[140px] flex items-center justify-center bg-gray-100 text-gray-400">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                )}

                {/* Metadata */}
                <div className="p-2.5 flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {asset.width > 0 && asset.height > 0
                      ? `${asset.width}×${asset.height} · `
                      : ''}
                    {asset.format} · {formatBytes(asset.bytes)}
                  </span>
                </div>

                {/* Copied confirmation overlay */}
                {isCopied && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <span className="text-white text-sm font-medium px-3 py-1.5 bg-cl-green rounded-md">
                      URL copied
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Inline error (when some assets already loaded) */}
      {error && assets.length > 0 && (
        <p className="m-0 text-sm text-cl-red text-center">{error}</p>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            className="px-6 py-2.5 bg-cl-blue text-white border-none rounded-lg text-sm/5 font-medium cursor-pointer transition-colors duration-150 hover:bg-cl-blue-dark disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={loadMore}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
