import {useCallback, useEffect, useState} from 'react'
import {type AssetFromSource} from 'sanity'
import {Box, Button, Card, Dialog, Flex, Spinner, Stack, Text, useToast} from '@sanity/ui'
import {WarningOutlineIcon, ResetIcon} from '@sanity/icons'
import {useCloudinaryWidget} from './useCloudinaryWidget'
import {CloudinaryIcon} from './CloudinaryIcon'
import type {CloudinaryAsset} from './types'

interface CloudinaryPluginConfig {
  cloudName: string
  apiKey: string
  uploadPreset?: string
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
  const {loaded, error, retry, retrying} = useCloudinaryWidget()
  const toast = useToast()
  const [opened, setOpened] = useState(false)

  const handleInsert = useCallback(
    (data: {assets: CloudinaryAsset[]}) => {
      if (!data?.assets?.length) {
        toast.push({
          status: 'warning',
          title: 'No assets selected',
          description: 'Please select at least one image from the Cloudinary library.',
          closable: true,
        })
        return
      }

      const sanityAssets: AssetFromSource[] = data.assets.map((asset) => ({
        kind: 'url' as const,
        value: assetUrl(asset),
      }))

      onSelect(sanityAssets)
    },
    [onSelect, toast],
  )

  useEffect(() => {
    if (!loaded || !window.cloudinary || opened) return

    if (!pluginConfig.cloudName || !pluginConfig.apiKey) {
      return
    }

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
            <Flex gap={2} align="center">
              <Text size={2}>
                <WarningOutlineIcon />
              </Text>
              <Text size={2} weight="semibold">
                Cloudinary Not Configured
              </Text>
            </Flex>
            <Text size={1} muted>
              Set SANITY_STUDIO_CLOUDINARY_CLOUD_NAME and SANITY_STUDIO_CLOUDINARY_API_KEY
              environment variables to enable Cloudinary.
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
          <Stack space={3}>
            <Flex gap={2} align="center">
              <Text size={2}>
                <WarningOutlineIcon />
              </Text>
              <Text size={2} weight="semibold">
                Failed to Load Cloudinary
              </Text>
            </Flex>
            <Text size={1} muted>
              {error}
            </Text>
            {retry && (
              <Box>
                <Button
                  icon={ResetIcon}
                  text={retrying ? 'Retrying...' : 'Try again'}
                  mode="ghost"
                  tone="primary"
                  onClick={retry}
                  disabled={retrying}
                />
              </Box>
            )}
            {!retry && (
              <Text size={1} muted>
                Please reload the page to try again.
              </Text>
            )}
          </Stack>
        </Card>
      </Dialog>
    )
  }

  if (!opened) {
    return (
      <Dialog
        header="Cloudinary"
        id="cloudinary-asset-source"
        onClose={onClose}
        width={1}
      >
        <Card padding={5}>
          <Flex direction="column" align="center" justify="center" gap={3}>
            <Text size={3} muted>
              <CloudinaryIcon />
            </Text>
            <Spinner muted />
            <Text size={1} muted>
              Opening Cloudinary Media Library...
            </Text>
          </Flex>
        </Card>
      </Dialog>
    )
  }

  return null
}
