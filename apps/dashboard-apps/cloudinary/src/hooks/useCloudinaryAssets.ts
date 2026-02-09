import {useState, useEffect, useCallback, useRef} from 'react'
import type {
  CloudinaryProxyAsset,
  CloudinaryProxyResponse,
} from '../types/cloudinary'

const API_BASE = import.meta.env.SANITY_APP_API_URL || 'http://localhost:3000'

interface UseCloudinaryAssetsOptions {
  query?: string
  folder?: string
  tag?: string
}

interface UseCloudinaryAssetsReturn {
  assets: CloudinaryProxyAsset[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

export function useCloudinaryAssets(
  options: UseCloudinaryAssetsOptions = {},
): UseCloudinaryAssetsReturn {
  const [assets, setAssets] = useState<CloudinaryProxyAsset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchAssets = useCallback(
    async (cursor?: string) => {
      // Abort any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.query) params.set('q', options.query)
      if (options.folder) params.set('folder', options.folder)
      if (options.tag) params.set('tag', options.tag)
      if (cursor) params.set('cursor', cursor)
      params.set('max_results', '30')

      try {
        const res = await fetch(
          `${API_BASE}/api/cloudinary?${params.toString()}`,
          {signal: controller.signal},
        )
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(
            body.error || `HTTP ${res.status}`,
          )
        }
        const data: CloudinaryProxyResponse = await res.json()

        setAssets((prev) => (cursor ? [...prev, ...data.assets] : data.assets))
        setNextCursor(data.next_cursor)
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'Failed to load assets')
        }
      } finally {
        setIsLoading(false)
      }
    },
    [options.query, options.folder, options.tag],
  )

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchAssets()
    return () => abortRef.current?.abort()
  }, [fetchAssets])

  const loadMore = useCallback(() => {
    if (nextCursor && !isLoading) {
      fetchAssets(nextCursor)
    }
  }, [nextCursor, isLoading, fetchAssets])

  const refresh = useCallback(() => {
    setAssets([])
    setNextCursor(null)
    fetchAssets()
  }, [fetchAssets])

  return {
    assets,
    isLoading,
    error,
    hasMore: nextCursor !== null,
    loadMore,
    refresh,
  }
}
