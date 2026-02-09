interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  uploadPreset: string
  isConfigured: boolean
  missingVars: string[]
}

export function useCloudinaryConfig(): CloudinaryConfig {
  const cloudName = import.meta.env.SANITY_APP_CLOUDINARY_CLOUD_NAME || ''
  const apiKey = import.meta.env.SANITY_APP_CLOUDINARY_API_KEY || ''
  const uploadPreset =
    import.meta.env.SANITY_APP_CLOUDINARY_UPLOAD_PRESET || ''

  const missingVars: string[] = []
  if (!cloudName) missingVars.push('SANITY_APP_CLOUDINARY_CLOUD_NAME')
  if (!apiKey) missingVars.push('SANITY_APP_CLOUDINARY_API_KEY')

  return {
    cloudName,
    apiKey,
    uploadPreset,
    isConfigured: missingVars.length === 0,
    missingVars,
  }
}
