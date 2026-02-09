import {useCallback, useEffect, useState} from 'react'
import {type AssetFromSource} from 'sanity'
import {Dialog, Card, Spinner, Stack, Text} from '@sanity/ui'
import {useCloudinaryWidget} from './useCloudinaryWidget'
import type {CloudinaryAsset} from './types'

interface CloudinaryPluginConfig {
  cloudName: string
  apiKey: string
}

let pluginConfig: CloudinaryPluginConfig = {cloudName: '', apiKey: ''}

export function setPluginConfig(config: CloudinaryPluginConfig) {
  pluginConfig = config
}

interface CloudinaryAssetSourceProps {
  onSelect: (assets: AssetFromSource[]) => void
  onClose: () => void
  selectionType: 'single' | 'multiple'
}

function assetUrl(asset: CloudinaryAsset): string {
  if (asset.derived && asset.derived.length > 0) {
    const [derived] = asset.derived
    if (derived.secure_url) {
      return derived.secure_url
    }
    return derived.url
  }
  return asset.secure_url || asset.url
}

export function CloudinaryAssetSource({
  onSelect,
  onClose,
  selectionType,
}: CloudinaryAssetSourceProps) {
  const {loaded, error} = useCloudinaryWidget()
  const [opened, setOpened] = useState(false)

  const handleInsert = useCallback(
    (data: {assets: CloudinaryAsset[]}) => {
      if (!data?.assets?.length) return

      const sanityAssets: AssetFromSource[] = data.assets.map((asset) => ({
        kind: 'url' as const,
        value: assetUrl(asset),
        assetDocumentProps: {
          originalFilename: `${asset.public_id.split('/').pop()}.${asset.format}`,
          source: {
            name: 'cloudinary',
            id: asset.public_id,
            url: asset.secure_url,
          },
          creditLine: `Cloudinary: ${asset.public_id}`,
        },
      }))

      onSelect(sanityAssets)
    },
    [onSelect],
  )

  useEffect(() => {
    if (!loaded || !window.cloudinary || opened) return

    if (!pluginConfig.cloudName || !pluginConfig.apiKey) {
      return
    }

    // Use openMediaLibrary (modal mode) — same approach as the official
    // sanity-plugin-cloudinary. Modal mode avoids nested iframe cookie issues
    // that can prevent the Cloudinary login flow in inline mode.
    window.cloudinary.openMediaLibrary(
      {
        cloud_name: pluginConfig.cloudName,
        api_key: pluginConfig.apiKey,
        insert_caption: 'Select',
        multiple: selectionType === 'multiple',
        default_transformations: [[{quality: 'auto'}, {fetch_format: 'auto'}]],
        integration: {
          type: 'sanity_mutual_aid',
          platform: 'sanity',
          version: '1.0.0',
          environment: 'production',
        },
      },
      {
        insertHandler: handleInsert,
      },
    )

    setOpened(true)
  }, [loaded, handleInsert, selectionType, opened])

  if (!pluginConfig.cloudName || !pluginConfig.apiKey) {
    return (
      <Dialog
        header="Cloudinary"
        id="cloudinary-asset-source"
        onClose={onClose}
        width={1}
      >
        <Card padding={4}>
          <Stack space={3}>
            <Text weight="semibold">Cloudinary is not configured</Text>
            <Text size={1} muted>
              Set SANITY_STUDIO_CLOUDINARY_CLOUD_NAME and
              SANITY_STUDIO_CLOUDINARY_API_KEY environment variables to enable
              Cloudinary.
            </Text>
          </Stack>
        </Card>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog
        header="Cloudinary"
        id="cloudinary-asset-source"
        onClose={onClose}
        width={1}
      >
        <Card padding={4}>
          <Text>{error}</Text>
        </Card>
      </Dialog>
    )
  }

  // Show a brief loading state while the modal opens
  if (!opened) {
    return (
      <Dialog
        header="Cloudinary"
        id="cloudinary-asset-source"
        onClose={onClose}
        width={1}
      >
        <Card padding={5} style={{display: 'flex', justifyContent: 'center'}}>
          <Spinner muted />
        </Card>
      </Dialog>
    )
  }

  // Modal is now open — Cloudinary handles its own UI.
  // Return null since the modal is rendered by Cloudinary, not by us.
  return null
}
