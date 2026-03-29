import {useCallback, useState} from 'react'
import {
  type ObjectInputProps,
  set,
  unset,
  type PatchEvent,
} from 'sanity'
import {Button, Card, Flex, Stack, Text, TextInput, Box} from '@sanity/ui'
import {ImageIcon, TrashIcon, EditIcon} from '@sanity/icons'
import {useCloudinaryWidget} from './useCloudinaryWidget'
import type {CloudinaryAsset} from './types'

interface CloudinaryImageValue {
  _type: string
  public_id?: string
  format?: string
  width?: number
  height?: number
  version?: number
  alt?: string
}

function getCloudName(): string {
  return (
    (typeof process !== 'undefined' &&
      process.env?.SANITY_STUDIO_CLOUDINARY_CLOUD_NAME) ||
    ''
  )
}

function buildThumbnailUrl(
  public_id: string,
  format: string,
  version?: number,
): string {
  const cloudName = getCloudName()
  const v = version ? `v${version}/` : ''
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_400,h_300,f_auto,q_auto/${v}${public_id}.${format}`
}

export function CloudinaryImageInput(props: ObjectInputProps) {
  const {onChange, value, schemaType} = props
  const typedValue = value as CloudinaryImageValue | undefined
  const {loaded, error} = useCloudinaryWidget()
  const [widgetOpen, setWidgetOpen] = useState(false)

  const handleSelect = useCallback(
    (data: {assets: CloudinaryAsset[]}) => {
      if (!data?.assets?.length) return

      const asset = data.assets[0]
      const patch = set({
        _type: schemaType.name,
        public_id: asset.public_id,
        format: asset.format,
        width: asset.width,
        height: asset.height,
        version: parseInt(
          asset.secure_url?.match(/\/v(\d+)\//)?.[1] || '0',
          10,
        ) || undefined,
        alt: typedValue?.alt || '',
      })
      onChange(patch)
      setWidgetOpen(false)
    },
    [onChange, schemaType.name, typedValue?.alt],
  )

  const handleOpen = useCallback(() => {
    if (!window.cloudinary) return

    const cloudName = getCloudName()
    const apiKey =
      (typeof process !== 'undefined' &&
        process.env?.SANITY_STUDIO_CLOUDINARY_API_KEY) ||
      ''

    if (!cloudName || !apiKey) return

    setWidgetOpen(true)
    window.cloudinary.openMediaLibrary(
      {
        cloud_name: cloudName,
        api_key: apiKey,
        insert_caption: 'Select',
        multiple: false,
        default_transformations: [[{quality: 'auto'}, {fetch_format: 'auto'}]],
        integration: {
          type: 'sanity_mutual_aid',
          platform: 'sanity',
          version: '1.0.0',
          environment: 'production',
        },
      },
      {
        insertHandler: handleSelect,
        hideHandler: () => setWidgetOpen(false),
      },
    )
  }, [handleSelect])

  const handleClear = useCallback(() => {
    onChange(unset())
  }, [onChange])

  const handleAltChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(set(event.target.value, ['alt']))
    },
    [onChange],
  )

  const hasImage = !!typedValue?.public_id

  if (!getCloudName()) {
    return (
      <Card padding={3} radius={2} shadow={1} tone="caution">
        <Text size={1}>
          Cloudinary not configured. Set SANITY_STUDIO_CLOUDINARY_CLOUD_NAME and
          SANITY_STUDIO_CLOUDINARY_API_KEY environment variables.
        </Text>
      </Card>
    )
  }

  if (error) {
    return (
      <Card padding={3} radius={2} shadow={1} tone="critical">
        <Text size={1}>{error}</Text>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      {hasImage ? (
        <Card radius={2} overflow="hidden" border>
          <img
            src={buildThumbnailUrl(
              typedValue.public_id!,
              typedValue.format || 'jpg',
              typedValue.version,
            )}
            alt={typedValue.alt || ''}
            style={{
              display: 'block',
              width: '100%',
              maxHeight: '300px',
              objectFit: 'contain',
              backgroundColor: '#f3f3f3',
            }}
          />
          <Box padding={2}>
            <Flex gap={2} align="center">
              <Box flex={1}>
                <Text size={1} muted>
                  {typedValue.public_id}.{typedValue.format}
                  {typedValue.width && typedValue.height
                    ? ` (${typedValue.width}×${typedValue.height})`
                    : ''}
                </Text>
              </Box>
              <Button
                icon={EditIcon}
                mode="ghost"
                tone="primary"
                text="Replace"
                fontSize={1}
                padding={2}
                onClick={handleOpen}
                disabled={!loaded || widgetOpen}
              />
              <Button
                icon={TrashIcon}
                mode="ghost"
                tone="critical"
                text="Remove"
                fontSize={1}
                padding={2}
                onClick={handleClear}
              />
            </Flex>
          </Box>
        </Card>
      ) : (
        <Card
          padding={5}
          radius={2}
          border
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '150px',
            backgroundColor: '#fafafa',
          }}
        >
          <Stack space={3} style={{textAlign: 'center'}}>
            <Text size={4} muted>
              <ImageIcon />
            </Text>
            <Button
              icon={ImageIcon}
              text="Select from Cloudinary"
              tone="primary"
              onClick={handleOpen}
              disabled={!loaded || widgetOpen}
            />
          </Stack>
        </Card>
      )}

      {hasImage && (
        <TextInput
          value={typedValue.alt || ''}
          onChange={handleAltChange}
          placeholder="Describe the image for accessibility"
          fontSize={1}
        />
      )}
    </Stack>
  )
}
