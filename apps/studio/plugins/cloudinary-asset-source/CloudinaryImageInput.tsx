import {useCallback, useEffect, useRef, useState} from 'react'
import {type ObjectInputProps, set, unset} from 'sanity'
import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
  useToast,
} from '@sanity/ui'
import {TrashIcon, WarningOutlineIcon, ResetIcon} from '@sanity/icons'
import {useCloudinaryWidget} from './useCloudinaryWidget'
import {EmptyState} from './EmptyState'
import {ImagePreview} from './ImagePreview'
import {getCloudName, getApiKey, suggestAltFromPublicId} from './utils'
import type {CloudinaryAsset} from './types'

interface CloudinaryImageValue {
  _type: string
  public_id?: string
  format?: string
  width?: number
  height?: number
  version?: number
  bytes?: number
  gravity?: string
  alt?: string
}

const WIDGET_SAFETY_TIMEOUT_MS = 60_000

export function CloudinaryImageInput(props: ObjectInputProps) {
  const {onChange, value, schemaType} = props
  const typedValue = value as CloudinaryImageValue | undefined
  const {loaded, error, retry, retrying} = useCloudinaryWidget()
  const toast = useToast()
  const [widgetOpen, setWidgetOpen] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Safety timeout — force-reset widgetOpen if it stays true too long
  useEffect(() => {
    return () => {
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current)
    }
  }, [])

  const clearSafetyTimeout = useCallback(() => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current)
      safetyTimeoutRef.current = null
    }
  }, [])

  const handleSelect = useCallback(
    (data: {assets: CloudinaryAsset[]}) => {
      clearSafetyTimeout()

      if (!data?.assets?.length) {
        toast.push({
          status: 'warning',
          title: 'No image selected',
          description: 'Close the Cloudinary dialog or select an image to continue.',
          closable: true,
        })
        setWidgetOpen(false)
        return
      }

      const asset = data.assets[0]
      const patch = set({
        _type: schemaType.name,
        public_id: asset.public_id,
        format: asset.format,
        width: asset.width,
        height: asset.height,
        version:
          parseInt(asset.secure_url?.match(/\/v(\d+)\//)?.[1] || '0', 10) || undefined,
        bytes: asset.bytes || undefined,
        alt: typedValue?.alt || suggestAltFromPublicId(asset.public_id),
      })
      onChange(patch)
      setWidgetOpen(false)
    },
    [onChange, schemaType.name, typedValue?.alt, toast, clearSafetyTimeout],
  )

  const handleOpen = useCallback(() => {
    if (!window.cloudinary) return

    const cloudName = getCloudName()
    const apiKey = getApiKey()

    if (!cloudName || !apiKey) return

    try {
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
          hideHandler: () => {
            clearSafetyTimeout()
            setWidgetOpen(false)
          },
        },
      )

      setWidgetOpen(true)
      safetyTimeoutRef.current = setTimeout(() => {
        setWidgetOpen(false)
      }, WIDGET_SAFETY_TIMEOUT_MS)
    } catch (err) {
      setWidgetOpen(false)
      toast.push({
        status: 'error',
        title: 'Failed to open Cloudinary',
        description: err instanceof Error ? err.message : 'An unexpected error occurred.',
        closable: true,
      })
    }
  }, [handleSelect, toast, clearSafetyTimeout])

  const handleUploadComplete = useCallback(
    (data: {
      public_id: string
      format: string
      width: number
      height: number
      version: number
      bytes: number
    }) => {
      const patch = set({
        _type: schemaType.name,
        public_id: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height,
        version: data.version,
        bytes: data.bytes,
        alt: suggestAltFromPublicId(data.public_id),
      })
      onChange(patch)
    },
    [onChange, schemaType.name],
  )

  const handleClear = useCallback(() => {
    onChange(unset())
    setShowRemoveConfirm(false)
  }, [onChange])

  const handleGravityChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(set(event.target.value, ['gravity']))
    },
    [onChange],
  )

  const handleAltChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(set(event.target.value, ['alt']))
    },
    [onChange],
  )

  const hasImage = !!typedValue?.public_id

  // Configuration error
  if (!getCloudName()) {
    return (
      <Card padding={4} radius={2} shadow={1} tone="caution">
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
            Set SANITY_STUDIO_CLOUDINARY_CLOUD_NAME and SANITY_STUDIO_CLOUDINARY_API_KEY environment
            variables.
          </Text>
        </Stack>
      </Card>
    )
  }

  // Script load error
  if (error) {
    return (
      <Card padding={4} radius={2} shadow={1} tone="critical">
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
    )
  }

  const altLength = (typedValue?.alt || '').length

  return (
    <Stack space={3}>
      {hasImage ? (
        <ImagePreview
          value={typedValue!}
          loaded={loaded}
          widgetOpen={widgetOpen}
          onReplace={handleOpen}
          onRemove={() => setShowRemoveConfirm(true)}
        />
      ) : (
        <EmptyState
          loaded={loaded}
          widgetOpen={widgetOpen}
          onBrowse={handleOpen}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Crop focus */}
      {hasImage && (
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Crop focus
          </Text>
          <Select
            value={typedValue?.gravity || 'auto'}
            onChange={handleGravityChange}
            fontSize={1}
          >
            <option value="auto">Auto (AI detect)</option>
            <option value="face">Face detection</option>
            <option value="center">Center</option>
          </Select>
          <Text size={0} muted>
            Where to focus when the image is cropped to fit a container
          </Text>
        </Stack>
      )}

      {/* Alt text input */}
      {hasImage && (
        <Stack space={2}>
          <Flex align="center" gap={2}>
            <Text size={1} weight="semibold">
              Alt text
            </Text>
            <Badge tone="caution" fontSize={0}>
              Recommended
            </Badge>
          </Flex>
          <TextInput
            value={typedValue?.alt || ''}
            onChange={handleAltChange}
            placeholder="Describe the image for accessibility"
            fontSize={1}
          />
          <Text
            size={0}
            muted
            style={{
              color: altLength > 125 ? 'var(--card-badge-critical-fg-color)' : undefined,
            }}
          >
            {altLength}/125 characters
          </Text>
        </Stack>
      )}

      {/* Remove confirmation dialog */}
      {showRemoveConfirm && (
        <Dialog
          header="Remove image"
          id="cloudinary-remove-confirm"
          onClose={() => setShowRemoveConfirm(false)}
          width={0}
        >
          <Card padding={4}>
            <Stack space={4}>
              <Text>
                Are you sure you want to remove this image? This will clear the image selection and
                alt text.
              </Text>
              <Flex gap={2} justify="flex-end">
                <Button text="Cancel" mode="ghost" onClick={() => setShowRemoveConfirm(false)} />
                <Button
                  text="Remove"
                  tone="critical"
                  icon={TrashIcon}
                  onClick={handleClear}
                />
              </Flex>
            </Stack>
          </Card>
        </Dialog>
      )}
    </Stack>
  )
}
