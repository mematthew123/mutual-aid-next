import {useCallback, useEffect, useRef, useState} from 'react'
import {useExternalScript} from '../hooks/useExternalScript'
import type {
  CloudinaryUploadWidget,
  CloudinaryUploadResult,
} from '../types/cloudinary'

const UPLOAD_SCRIPT_URL = 'https://upload-widget.cloudinary.com/global/all.js'

interface UploadPanelProps {
  config: {
    cloudName: string
    uploadPreset: string
  }
}

interface UploadedFile {
  publicId: string
  url: string
  format: string
  width: number
  height: number
  bytes: number
}

export function UploadPanel({config}: UploadPanelProps) {
  const widgetRef = useRef<CloudinaryUploadWidget | null>(null)
  const {loaded, error} = useExternalScript(UPLOAD_SCRIPT_URL)
  const [uploads, setUploads] = useState<UploadedFile[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const handleUploadResult = useCallback(
    (_error: Error | null, result: CloudinaryUploadResult) => {
      if (result?.event === 'success') {
        setUploads((prev) => [
          ...prev,
          {
            publicId: result.info.public_id,
            url: result.info.secure_url,
            format: result.info.format,
            width: result.info.width,
            height: result.info.height,
            bytes: result.info.bytes,
          },
        ])
      }
      if (result?.event === 'close') {
        setIsOpen(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (!loaded || !window.cloudinary) return

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: config.cloudName,
        uploadPreset: config.uploadPreset || 'ml_default',
        sources: ['local', 'url', 'camera'],
        multiple: true,
      },
      handleUploadResult,
    )

    return () => {
      widgetRef.current?.destroy()
    }
  }, [loaded, config.cloudName, config.uploadPreset, handleUploadResult])

  const openWidget = () => {
    widgetRef.current?.open()
    setIsOpen(true)
  }

  if (!config.uploadPreset) {
    return (
      <div className="px-8 py-12 text-center">
        <h3 className="m-0 mb-3 text-lg text-gray-700">
          Upload Preset Required
        </h3>
        <p className="text-gray-500 m-0 mb-6 max-w-lg mx-auto">
          To enable uploads, create an unsigned upload preset in your Cloudinary
          console and set the{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-sm">
            SANITY_APP_CLOUDINARY_UPLOAD_PRESET
          </code>{' '}
          environment variable.
        </p>
        <div className="bg-gray-50 rounded-lg px-6 py-5 text-left max-w-lg mx-auto">
          <h4 className="m-0 mb-2 text-sm text-gray-700">Setup Steps:</h4>
          <ol className="m-0 pl-5 text-gray-500 text-sm/7">
            <li>
              Go to{' '}
              <strong>
                Cloudinary Console &rarr; Settings &rarr; Upload Presets
              </strong>
            </li>
            <li>Click &quot;Add Upload Preset&quot;</li>
            <li>Set Signing Mode to &quot;Unsigned&quot;</li>
            <li>
              Set a name (e.g.,{' '}
              <code className="bg-gray-100 px-1 rounded-xs text-xs">
                sanity_uploads
              </code>
              )
            </li>
            <li>
              Save and add to your{' '}
              <code className="bg-gray-100 px-1 rounded-xs text-xs">
                .env.local
              </code>
            </li>
          </ol>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-8 py-12 text-center text-cl-red">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-center py-8">
        <button
          className="px-8 py-3 bg-cl-blue text-white border-none rounded-lg text-sm/5 font-medium cursor-pointer transition-colors duration-150 hover:bg-cl-blue-dark disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={openWidget}
          disabled={!loaded || isOpen}
          type="button"
        >
          {isOpen ? 'Upload Widget Open...' : 'Open Upload Widget'}
        </button>
      </div>

      {uploads.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="m-0 mb-4 text-base font-semibold text-gray-700">
            Uploaded ({uploads.length})
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {uploads.map((file) => (
              <div
                key={file.publicId}
                className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
              >
                <img
                  src={file.url}
                  alt={file.publicId}
                  className="w-full h-[140px] object-cover block"
                />
                <div className="p-2.5 flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                    {file.publicId}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {file.width}x{file.height} &middot; {file.format} &middot;{' '}
                    {formatBytes(file.bytes)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
