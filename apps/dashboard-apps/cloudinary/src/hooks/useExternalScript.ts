import {useEffect, useState} from 'react'

export function useExternalScript(url: string): {
  loaded: boolean
  error: string | null
} {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const existing = document.querySelector(`script[src="${url}"]`)
    if (existing) {
      if (existing.getAttribute('data-loaded') === 'true') {
        setLoaded(true)
      } else {
        existing.addEventListener('load', () => setLoaded(true))
      }
      return
    }

    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = () => {
      script.setAttribute('data-loaded', 'true')
      setLoaded(true)
    }
    script.onerror = () => setError(`Failed to load script: ${url}`)
    document.head.appendChild(script)
  }, [url])

  return {loaded, error}
}
