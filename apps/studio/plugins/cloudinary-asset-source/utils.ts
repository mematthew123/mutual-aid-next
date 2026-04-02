export function getCloudName(): string {
  return (
    (typeof process !== 'undefined' && process.env?.SANITY_STUDIO_CLOUDINARY_CLOUD_NAME) || ''
  )
}

export function getApiKey(): string {
  return (
    (typeof process !== 'undefined' && process.env?.SANITY_STUDIO_CLOUDINARY_API_KEY) || ''
  )
}

export function getUploadPreset(): string {
  return (
    (typeof process !== 'undefined' && process.env?.SANITY_STUDIO_CLOUDINARY_UPLOAD_PRESET) || ''
  )
}

export function buildCloudinaryUrl(
  publicId: string,
  format: string,
  version?: number,
  transforms?: string,
): string {
  const cloudName = getCloudName()
  const t = transforms || 'f_auto,q_auto'
  const v = version ? `v${version}/` : ''
  return `https://res.cloudinary.com/${cloudName}/image/upload/${t}/${v}${publicId}.${format}`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getFilenameFromPublicId(publicId: string): string {
  return publicId.split('/').pop() || publicId
}

export function suggestAltFromPublicId(publicId: string): string {
  const filename = getFilenameFromPublicId(publicId)
  const cleaned = filename.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim()
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}
