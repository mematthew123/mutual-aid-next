import {definePlugin} from 'sanity'
import {CloudinaryAssetSource, setPluginConfig} from './CloudinaryAssetSource'
import {CloudinaryIcon} from './CloudinaryIcon'

export interface CloudinaryPluginConfig {
  cloudName: string
  apiKey: string
  uploadPreset?: string
}

const cloudinaryAssetSource = {
  name: 'cloudinary',
  title: 'Cloudinary',
  component: CloudinaryAssetSource,
  icon: CloudinaryIcon,
}

export const cloudinaryAssetSourcePlugin = definePlugin<CloudinaryPluginConfig>(
  (config) => {
    setPluginConfig(config)
    return {
      name: 'cloudinary-asset-source',
      form: {
        image: {
          assetSources: (prev) => [...prev, cloudinaryAssetSource],
        },
      },
    }
  },
)
