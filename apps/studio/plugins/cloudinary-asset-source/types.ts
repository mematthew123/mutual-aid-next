export interface CloudinaryDerivedAsset {
  url: string
  secure_url: string
  raw_transformation: string
}

export interface CloudinaryAsset {
  public_id: string
  secure_url: string
  url: string
  format: string
  resource_type: string
  type: string
  width: number
  height: number
  bytes: number
  created_at: string
  tags: string[]
  derived?: CloudinaryDerivedAsset[]
}

export interface CloudinaryInsertResult {
  assets: CloudinaryAsset[]
}

export interface CloudinaryIntegration {
  type: string
  platform: string
  version: string
  environment: string
}

export interface CloudinaryMediaLibraryOptions {
  cloud_name: string
  api_key: string
  inline_container?: string | HTMLElement
  multiple?: boolean
  remove_header?: boolean
  max_files?: number
  insert_caption?: string
  default_transformations?: Array<Array<Record<string, string>>>
  integration?: CloudinaryIntegration
  asset?: {
    public_id: string
    type: string
    resource_type: string
  }
}

export interface CloudinaryMediaLibraryWidget {
  show: (options?: Record<string, unknown>) => void
  hide: () => void
  destroy: () => void
}

export interface CloudinaryMediaLibraryCallbacks {
  insertHandler?: (data: CloudinaryInsertResult) => void
  showHandler?: () => void
  hideHandler?: () => void
}

export interface CloudinaryUploadWidgetOptions {
  cloudName: string
  uploadPreset: string
  sources?: string[]
  multiple?: boolean
  folder?: string
  tags?: string[]
}

export interface CloudinaryUploadResultInfo {
  public_id: string
  secure_url: string
  url: string
  format: string
  width: number
  height: number
  bytes: number
  version: number
  created_at: string
  tags: string[]
}

export interface CloudinaryUploadResult {
  event: string
  info: CloudinaryUploadResultInfo
}

export interface CloudinaryUploadWidget {
  open: () => void
  close: () => void
  destroy: () => void
}

declare global {
  interface Window {
    cloudinary?: {
      createMediaLibrary: (
        options: CloudinaryMediaLibraryOptions,
        callbacks: CloudinaryMediaLibraryCallbacks,
      ) => CloudinaryMediaLibraryWidget
      openMediaLibrary: (
        options: CloudinaryMediaLibraryOptions,
        callbacks: CloudinaryMediaLibraryCallbacks,
      ) => void
      createUploadWidget: (
        options: CloudinaryUploadWidgetOptions,
        callback: (error: Error | null, result: CloudinaryUploadResult) => void,
      ) => CloudinaryUploadWidget
    }
  }
}
