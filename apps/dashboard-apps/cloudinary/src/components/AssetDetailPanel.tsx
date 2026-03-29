import {useState, useEffect} from 'react'
import type {CloudinaryProxyAsset} from '../types/cloudinary'

const API_BASE = import.meta.env.SANITY_APP_API_URL || 'http://localhost:3000'
const STUDIO_URL = import.meta.env.SANITY_APP_STUDIO_URL || 'http://localhost:3333'

interface LinkedDocument {
  _id: string
  _type: string
  title: string
  slug?: string
}

const DOC_TYPE_LABELS: Record<string, string> = {
  event: 'Event',
  donationCampaign: 'Campaign',
  communityResource: 'Resource',
  teamMember: 'Team Member',
  page: 'Page',
  settings: 'Settings',
}

const DOC_TYPE_COLORS: Record<string, string> = {
  event: 'bg-amber-100 text-amber-700',
  donationCampaign: 'bg-green-100 text-green-700',
  communityResource: 'bg-blue-100 text-blue-700',
  teamMember: 'bg-purple-100 text-purple-700',
  page: 'bg-gray-100 text-gray-600',
  settings: 'bg-gray-100 text-gray-600',
}

interface AssetDetailPanelProps {
  asset: CloudinaryProxyAsset
  cloudName: string
  onClose: () => void
}

interface TransformPreset {
  label: string
  description: string
  transform: string
}

const PRESETS: TransformPreset[] = [
  {
    label: 'Event Card',
    description: '600×400, auto crop',
    transform: 'c_fill,w_600,h_400,g_auto,f_auto,q_auto',
  },
  {
    label: 'Hero Background',
    description: '1920×800, auto crop',
    transform: 'c_fill,w_1920,h_800,g_auto,f_auto,q_auto',
  },
  {
    label: 'Team Photo',
    description: '400×400, face detect',
    transform: 'c_fill,w_400,h_400,g_face,f_auto,q_auto',
  },
  {
    label: 'Social / OG',
    description: '1200×630, auto crop',
    transform: 'c_fill,w_1200,h_630,g_auto,f_auto,q_auto',
  },
  {
    label: 'Resource Logo',
    description: '200×200, fit',
    transform: 'c_fit,w_200,h_200,f_auto,q_auto',
  },
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function buildTransformUrl(
  cloudName: string,
  publicId: string,
  format: string,
  transform: string,
): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${publicId}.${format}`
}

export function AssetDetailPanel({asset, cloudName, onClose}: AssetDetailPanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [linkedDocs, setLinkedDocs] = useState<LinkedDocument[]>([])
  const [linksLoading, setLinksLoading] = useState(false)
  const displayName = asset.public_id.split('/').pop() || asset.public_id
  const optimizedUrl = buildTransformUrl(cloudName, asset.public_id, asset.format, 'f_auto,q_auto')

  // Fetch linked Sanity documents
  useEffect(() => {
    let cancelled = false
    setLinksLoading(true)
    setLinkedDocs([])

    fetch(
      `${API_BASE}/api/cloudinary?action=sanity-links&public_id=${encodeURIComponent(asset.public_id)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setLinkedDocs(data.documents || [])
          setLinksLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLinksLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [asset.public_id])

  const copyUrl = async (url: string, key: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-xl bg-white shadow-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="m-0 text-base font-semibold text-gray-900 truncate pr-4">
            {displayName}
          </h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer border-none bg-transparent text-lg"
            type="button"
          >
            &times;
          </button>
        </div>

        {/* Preview */}
        <div className="p-6">
          {asset.resource_type === 'image' ? (
            <img
              src={buildTransformUrl(cloudName, asset.public_id, asset.format, 'c_limit,w_800,f_auto,q_auto')}
              alt={displayName}
              className="w-full rounded-lg bg-gray-50"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
              Non-image asset
            </div>
          )}

          {/* Metadata */}
          <div className="mt-5 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="m-0 mb-3 text-sm font-semibold text-gray-700">
              Details
            </h3>
            <dl className="m-0 flex flex-col gap-2">
              {[
                ['Public ID', asset.public_id],
                ['Dimensions', asset.width > 0 ? `${asset.width} × ${asset.height}` : 'N/A'],
                ['Format', asset.format.toUpperCase()],
                ['Size', formatBytes(asset.bytes)],
                ['Type', asset.resource_type],
                ['Folder', asset.folder || '(root)'],
                ['Uploaded', new Date(asset.created_at).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 items-baseline">
                  <dt className="text-xs text-gray-500 min-w-[80px] shrink-0">{label}</dt>
                  <dd className="m-0 text-xs font-medium text-gray-700 break-all">{value}</dd>
                </div>
              ))}
              {asset.tags.length > 0 && (
                <div className="flex gap-3 items-start">
                  <dt className="text-xs text-gray-500 min-w-[80px] shrink-0">Tags</dt>
                  <dd className="m-0 flex flex-wrap gap-1.5">
                    {asset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Used In — Linked Sanity Documents */}
          <div className="mt-5 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="m-0 mb-3 text-sm font-semibold text-gray-700">
              Used In
            </h3>
            {linksLoading ? (
              <p className="m-0 text-xs text-gray-400">Loading...</p>
            ) : linkedDocs.length === 0 ? (
              <p className="m-0 text-xs text-gray-400">
                Not used in any documents
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {linkedDocs.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                          DOC_TYPE_COLORS[doc._type] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {DOC_TYPE_LABELS[doc._type] || doc._type}
                      </span>
                      <span className="text-xs font-medium text-gray-700 truncate">
                        {doc.title}
                      </span>
                    </div>
                    <a
                      href={`${STUDIO_URL}/intent/edit/id=${doc._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-700 shrink-0 no-underline"
                    >
                      Open in Studio &rarr;
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Copy URLs */}
          <div className="mt-5 flex flex-col gap-2">
            <CopyButton
              label="Copy Optimized URL"
              sublabel="f_auto, q_auto"
              url={optimizedUrl}
              copied={copiedKey === 'optimized'}
              onClick={() => copyUrl(optimizedUrl, 'optimized')}
            />
            <CopyButton
              label="Copy Original URL"
              sublabel="No transformations"
              url={asset.secure_url}
              copied={copiedKey === 'original'}
              onClick={() => copyUrl(asset.secure_url, 'original')}
            />
          </div>

          {/* Transformation Previews */}
          {asset.resource_type === 'image' && (
            <div className="mt-6">
              <h3 className="m-0 mb-4 text-sm font-semibold text-gray-700">
                Platform Presets
              </h3>
              <div className="flex flex-col gap-4">
                {PRESETS.map((preset) => {
                  const url = buildTransformUrl(cloudName, asset.public_id, asset.format, preset.transform)
                  const previewUrl = buildTransformUrl(
                    cloudName,
                    asset.public_id,
                    asset.format,
                    // Scale down preview to 300px wide
                    `${preset.transform}/c_scale,w_300`,
                  )
                  const key = `preset-${preset.label}`

                  return (
                    <div
                      key={preset.label}
                      className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50"
                    >
                      <img
                        src={previewUrl}
                        alt={`${displayName} — ${preset.label}`}
                        className="w-full h-32 object-cover bg-gray-100"
                        loading="lazy"
                      />
                      <div className="p-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="m-0 text-sm font-medium text-gray-700">
                            {preset.label}
                          </p>
                          <p className="m-0 text-[11px] text-gray-500">
                            {preset.description}
                          </p>
                        </div>
                        <button
                          className="px-3 py-1.5 bg-cl-blue text-white border-none rounded-md text-xs font-medium cursor-pointer hover:bg-cl-blue-dark transition-colors duration-150 shrink-0"
                          onClick={() => copyUrl(url, key)}
                          type="button"
                        >
                          {copiedKey === key ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CopyButton({
  label,
  sublabel,
  url,
  copied,
  onClick,
}: {
  label: string
  sublabel: string
  url: string
  copied: boolean
  onClick: () => void
}) {
  return (
    <button
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-colors duration-150 text-left"
      onClick={onClick}
      title={url}
      type="button"
    >
      <div>
        <p className="m-0 text-sm font-medium text-gray-700">{label}</p>
        <p className="m-0 text-[11px] text-gray-500">{sublabel}</p>
      </div>
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-md shrink-0 ${
          copied ? 'bg-cl-green text-white' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  )
}
