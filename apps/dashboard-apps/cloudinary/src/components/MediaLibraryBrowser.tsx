import {useCallback, useState} from 'react'
import {useExternalScript} from '../hooks/useExternalScript'

const ML_SCRIPT_URL = 'https://media-library.cloudinary.com/global/all.js'

interface MediaLibraryBrowserProps {
  config: {
    cloudName: string
    apiKey: string
  }
}

export function MediaLibraryBrowser({config}: MediaLibraryBrowserProps) {
  const {loaded, error} = useExternalScript(ML_SCRIPT_URL)
  const [copied, setCopied] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)

  const openLibrary = useCallback(() => {
    if (!window.cloudinary) return

    // Use openMediaLibrary (modal mode) — avoids nested iframe cookie
    // isolation that prevents authentication in inline mode.
    // This is the same approach used by the official sanity-plugin-cloudinary.
    window.cloudinary.openMediaLibrary(
      {
        cloud_name: config.cloudName,
        api_key: config.apiKey,
        multiple: true,
        insert_caption: 'Select',
        default_transformations: [[{quality: 'auto'}, {fetch_format: 'auto'}]],
        integration: {
          type: 'sanity_mutual_aid',
          platform: 'sanity',
          version: '1.0.0',
          environment: 'production',
        },
      },
      {
        insertHandler: (data) => {
          if (data?.assets?.length) {
            const urls = data.assets.map((a) => {
              // Prefer derived (transformed) URL when available
              if (a.derived?.length) {
                return a.derived[0].secure_url
              }
              return a.secure_url
            })
            setSelectedCount(urls.length)
            navigator.clipboard
              .writeText(urls.join('\n'))
              .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 3000)
              })
              .catch(() => {})
          }
        },
      },
    )
  }, [config.cloudName, config.apiKey])

  if (error) {
    return (
      <div className="px-8 py-12 text-center text-cl-red">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="#3448c5">
          <path d="M19.31 8.91A6.44 6.44 0 0 0 6.85 7.57a4.88 4.88 0 0 0-2.57 9.15.5.5 0 0 0 .35-.94 3.88 3.88 0 0 1 2.06-7.28l.4.04.13-.38a5.44 5.44 0 0 1 10.52 1.15l.09.56.52.2a3.38 3.38 0 0 1-.99 6.62h-.8a.5.5 0 0 0 0 1h.8a4.38 4.38 0 0 0 1.95-8.28zM14.35 14.7a.5.5 0 0 0 .71-.71l-2.82-2.83a.51.51 0 0 0-.36-.15.5.5 0 0 0-.36.15L8.7 13.99a.5.5 0 0 0 .71.71l1.97-1.97v5.78a.5.5 0 0 0 1 0v-5.78z" />
        </svg>
        <h2 className="m-0 text-lg font-semibold text-gray-900">
          Cloudinary Media Library
        </h2>
        <p className="m-0 text-sm/6 text-gray-500 max-w-md">
          Browse, search, and select media assets from your Cloudinary account.
          Selected asset URLs will be copied to your clipboard.
        </p>
      </div>

      <button
        className="px-8 py-3 bg-cl-blue text-white border-none rounded-lg text-sm/5 font-medium cursor-pointer transition-colors duration-150 hover:bg-cl-blue-dark disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={openLibrary}
        disabled={!loaded}
        type="button"
      >
        {!loaded ? 'Loading...' : 'Open Media Library'}
      </button>

      {copied && (
        <p className="m-0 text-sm text-cl-green font-medium">
          {selectedCount} asset URL{selectedCount !== 1 ? 's' : ''} copied to
          clipboard
        </p>
      )}
    </div>
  )
}
