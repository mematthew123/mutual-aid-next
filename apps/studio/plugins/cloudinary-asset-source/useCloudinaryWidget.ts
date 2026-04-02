import {useCallback, useEffect, useRef, useState} from 'react'

const MEDIA_LIBRARY_SCRIPT_URL = 'https://media-library.cloudinary.com/global/all.js'
const MAX_RETRIES = 3
const LOAD_TIMEOUT_MS = 15_000

export function useCloudinaryWidget(): {
  loaded: boolean
  error: string | null
  retry: (() => void) | null
  retrying: boolean
} {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [retrying, setRetrying] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (window.cloudinary?.openMediaLibrary) {
      setLoaded(true)
      setRetrying(false)
      return
    }

    const existing = document.querySelector(`script[src="${MEDIA_LIBRARY_SCRIPT_URL}"]`)
    if (existing && !retrying) {
      existing.addEventListener('load', () => {
        if (mountedRef.current) setLoaded(true)
      })
      return
    }

    // Remove any failed script tag before retrying
    if (retrying) {
      const old = document.querySelector(`script[src="${MEDIA_LIBRARY_SCRIPT_URL}"]`)
      old?.remove()
    }

    const script = document.createElement('script')
    script.src = MEDIA_LIBRARY_SCRIPT_URL
    script.async = true

    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return
      if (!loaded) {
        setError(
          'Cloudinary Media Library timed out. The CDN may be unreachable — check your network connection and try again.',
        )
        setRetrying(false)
      }
    }, LOAD_TIMEOUT_MS)

    script.onload = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (mountedRef.current) {
        setLoaded(true)
        setError(null)
        setRetrying(false)
      }
    }

    script.onerror = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (!mountedRef.current) return

      fetch(MEDIA_LIBRARY_SCRIPT_URL, {mode: 'no-cors'})
        .then(() => {
          if (mountedRef.current) {
            setError(
              'The Cloudinary Media Library script failed to execute. It may be blocked by a browser extension or Content Security Policy.',
            )
          }
        })
        .catch(() => {
          if (mountedRef.current) {
            setError(
              'Could not reach the Cloudinary CDN (media-library.cloudinary.com). This may be blocked by a firewall, ad blocker, or network issue.',
            )
          }
        })
        .finally(() => {
          if (mountedRef.current) setRetrying(false)
        })
    }

    document.head.appendChild(script)
  }, [retryCount]) // eslint-disable-line react-hooks/exhaustive-deps

  const retry = useCallback(() => {
    if (retryCount >= MAX_RETRIES) return
    setError(null)
    setLoaded(false)
    setRetrying(true)
    setRetryCount((c) => c + 1)
  }, [retryCount])

  return {
    loaded,
    error,
    retry: retryCount < MAX_RETRIES ? retry : null,
    retrying,
  }
}
