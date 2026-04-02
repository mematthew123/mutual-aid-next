import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {cloudinaryAssetSourcePlugin} from './plugins/cloudinary-asset-source'

export default defineConfig({
  name: 'default',
  title: 'Mutual Aid Network',

  projectId: '51mpsx72',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    cloudinaryAssetSourcePlugin({
      cloudName: process.env.SANITY_STUDIO_CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.SANITY_STUDIO_CLOUDINARY_API_KEY || '',
      uploadPreset: process.env.SANITY_STUDIO_CLOUDINARY_UPLOAD_PRESET || '',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
