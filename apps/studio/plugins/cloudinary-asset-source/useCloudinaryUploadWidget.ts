import {useEffect, useState} from 'react'

const UPLOAD_WIDGET_SCRIPT_URL = 'https://upload-widget.cloudinary.com/global/all.js'

export function useCloudinaryUploadWidget(): {loaded: boolean; error: string | null} {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (window.cloudinary?.createUploadWidget) {
      setLoaded(true)
      return
    }

    const existing = document.querySelector(`script[src="${UPLOAD_WIDGET_SCRIPT_URL}"]`)
    if (existing) {
      existing.addEventListener('load', () => setLoaded(true))
      return
    }

    const script = document.createElement('script')
    script.src = UPLOAD_WIDGET_SCRIPT_URL
    script.async = true
    script.onload = () => setLoaded(true)
    script.onerror = () => setError('Failed to load Cloudinary Upload Widget')
    document.head.appendChild(script)
  }, [])

  return {loaded, error}
}
