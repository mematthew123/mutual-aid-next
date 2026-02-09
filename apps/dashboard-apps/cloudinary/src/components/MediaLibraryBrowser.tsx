import {useEffect, useRef, useState} from 'react'
import {useExternalScript} from '../hooks/useExternalScript'
import type {CloudinaryMediaLibraryWidget} from '../types/cloudinary'

const ML_SCRIPT_URL = 'https://media-library.cloudinary.com/global/all.js'

const CONTAINER_ID = 'cloudinary-media-library'

interface MediaLibraryBrowserProps {
  config: {
    cloudName: string
    apiKey: string
  }
}

export function MediaLibraryBrowser({config}: MediaLibraryBrowserProps) {
  const widgetRef = useRef<CloudinaryMediaLibraryWidget | null>(null)
  const {loaded, error} = useExternalScript(ML_SCRIPT_URL)
  const [widgetReady, setWidgetReady] = useState(false)

  useEffect(() => {
    if (!loaded || !window.cloudinary) return
    if (widgetRef.current) {
      return () => {
        widgetRef.current?.destroy()
        widgetRef.current = null
      }
    }

    // Use CSS selector string for inline_container — matches the pattern
    // used by the official sanity-plugin-cloudinary
    widgetRef.current = window.cloudinary.createMediaLibrary(
      {
        cloud_name: config.cloudName,
        api_key: config.apiKey,
        inline_container: `#${CONTAINER_ID}`,
        multiple: true,
        remove_header: true,
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
            navigator.clipboard.writeText(urls.join('\n')).catch(() => {})
          }
        },
      },
    )

    widgetRef.current.show()
    setWidgetReady(true)

    return () => {
      widgetRef.current?.destroy()
      widgetRef.current = null
    }
  }, [loaded, config.cloudName, config.apiKey])

  if (error) {
    return (
      <div className="px-8 py-12 text-center text-cl-red">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-[500px]">
      {!widgetReady && (
        <div className="flex flex-col items-center justify-center px-8 py-16 gap-4 text-gray-500">
          <div
            className="size-8 border-3 border-gray-200 border-t-cl-blue rounded-full"
            style={{animation: 'cl-spin 0.8s linear infinite'}}
          />
          <p>Loading Cloudinary Media Library...</p>
        </div>
      )}
      <div
        id={CONTAINER_ID}
        className="min-h-[500px]"
        style={{visibility: widgetReady ? 'visible' : 'hidden'}}
      />
    </div>
  )
}
