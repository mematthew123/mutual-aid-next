import {useEffect, useState} from 'react'

const MEDIA_LIBRARY_SCRIPT_URL =
  'https://media-library.cloudinary.com/global/all.js'

export function useCloudinaryWidget(): {loaded: boolean; error: string | null} {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (window.cloudinary) {
      setLoaded(true)
      return
    }

    const existing = document.querySelector(
      `script[src="${MEDIA_LIBRARY_SCRIPT_URL}"]`,
    )
    if (existing) {
      existing.addEventListener('load', () => setLoaded(true))
      return
    }

    const script = document.createElement('script')
    script.src = MEDIA_LIBRARY_SCRIPT_URL
    script.async = true
    script.onload = () => setLoaded(true)
    script.onerror = () => setError('Failed to load Cloudinary Media Library')
    document.head.appendChild(script)
  }, [])

  return {loaded, error}
}
