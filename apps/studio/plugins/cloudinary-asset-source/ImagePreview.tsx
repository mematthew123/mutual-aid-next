import {useCallback, useState} from 'react'
import {Badge, Box, Button, Card, Flex, Grid, Label, Stack, Text, Tooltip, useToast} from '@sanity/ui'
import {
  EditIcon,
  TrashIcon,
  ClipboardIcon,
  InfoOutlineIcon,
  EyeOpenIcon,
} from '@sanity/icons'
import {buildCloudinaryUrl, formatBytes, getFilenameFromPublicId} from './utils'
import {
  TRANSFORMATION_PRESETS,
  buildPresetTransforms,
  type TransformationPreset,
} from './transformationPresets'

interface CloudinaryImageValue {
  _type: string
  public_id?: string
  format?: string
  width?: number
  height?: number
  version?: number
  bytes?: number
  alt?: string
}

interface ImagePreviewProps {
  value: CloudinaryImageValue
  loaded: boolean
  widgetOpen: boolean
  onReplace: () => void
  onRemove: () => void
}

export function ImagePreview({value, loaded, widgetOpen, onReplace, onRemove}: ImagePreviewProps) {
  const toast = useToast()
  const [selectedPreset, setSelectedPreset] = useState<TransformationPreset | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  const publicId = value.public_id || ''
  const format = value.format || 'jpg'
  const filename = getFilenameFromPublicId(publicId)

  const thumbnailUrl = selectedPreset
    ? buildCloudinaryUrl(publicId, format, value.version, buildPresetTransforms(selectedPreset))
    : buildCloudinaryUrl(publicId, format, value.version, 'c_limit,w_800,f_auto,q_auto')

  const optimizedUrl = buildCloudinaryUrl(publicId, format, value.version)

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(optimizedUrl).then(
      () => {
        toast.push({
          status: 'success',
          title: 'URL copied to clipboard',
          closable: true,
        })
      },
      () => {
        toast.push({
          status: 'error',
          title: 'Failed to copy URL',
          closable: true,
        })
      },
    )
  }, [optimizedUrl, toast])

  const handlePresetClick = useCallback(
    (preset: TransformationPreset) => {
      setSelectedPreset((current) => (current?.key === preset.key ? null : preset))
    },
    [],
  )

  const uploadDate = value.version
    ? new Date(value.version * 1000).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  const folder = publicId.includes('/') ? publicId.substring(0, publicId.lastIndexOf('/')) : null

  return (
    <Card radius={2} overflow="hidden" border>
      {/* Image */}
      <Card tone="transparent" style={{position: 'relative'}}>
        <img
          key={selectedPreset?.key || 'original'}
          src={thumbnailUrl}
          alt={value.alt || ''}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            maxHeight: '400px',
            objectFit: 'contain',
          }}
        />
        {selectedPreset && (
          <Box
            padding={2}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            }}
          >
            <Text size={0} style={{color: '#fff'}}>
              Previewing: {selectedPreset.label} ({selectedPreset.width}x{selectedPreset.height})
            </Text>
          </Box>
        )}
      </Card>

      {/* Info bar */}
      <Box padding={3}>
        <Flex gap={2} align="center" wrap="wrap">
          <Box flex={1}>
            <Flex gap={2} align="center" wrap="wrap">
              <Text size={1} weight="semibold">
                {filename}.{format}
              </Text>
              {value.width && value.height && (
                <Badge tone="default" fontSize={0}>
                  {value.width}x{value.height}
                </Badge>
              )}
              <Badge tone="default" fontSize={0}>
                {format.toUpperCase()}
              </Badge>
              {value.bytes && (
                <Badge tone="default" fontSize={0}>
                  {formatBytes(value.bytes)}
                </Badge>
              )}
            </Flex>
          </Box>
          <Flex gap={1}>
            <Tooltip
              content={
                <Box padding={2}>
                  <Text size={1}>Copy optimized URL</Text>
                </Box>
              }
              placement="top"
            >
              <Button
                icon={ClipboardIcon}
                mode="ghost"
                fontSize={1}
                padding={2}
                onClick={handleCopyUrl}
              />
            </Tooltip>
            <Button
              icon={EditIcon}
              mode="ghost"
              tone="primary"
              text="Replace"
              fontSize={1}
              padding={2}
              onClick={onReplace}
              disabled={!loaded || widgetOpen}
            />
            <Button
              icon={TrashIcon}
              mode="ghost"
              tone="critical"
              text="Remove"
              fontSize={1}
              padding={2}
              onClick={onRemove}
            />
          </Flex>
        </Flex>
      </Box>

      {/* Transformation presets */}
      <Box paddingX={3} paddingBottom={3}>
        <Stack space={2}>
          <Label size={0} muted>
            Preview as
          </Label>
          <Flex gap={2} wrap="wrap">
            {TRANSFORMATION_PRESETS.map((preset) => (
              <Button
                key={preset.key}
                text={preset.label}
                mode={selectedPreset?.key === preset.key ? 'default' : 'ghost'}
                tone={selectedPreset?.key === preset.key ? 'primary' : 'default'}
                fontSize={0}
                padding={2}
                onClick={() => handlePresetClick(preset)}
                icon={selectedPreset?.key === preset.key ? EyeOpenIcon : undefined}
              />
            ))}
          </Flex>
        </Stack>
      </Box>

      {/* Image info toggle */}
      <Box paddingX={3} paddingBottom={3}>
        <Button
          icon={InfoOutlineIcon}
          text={showInfo ? 'Hide details' : 'Image details'}
          mode="ghost"
          fontSize={1}
          padding={2}
          onClick={() => setShowInfo((s) => !s)}
        />

        {showInfo && (
          <Card tone="transparent" padding={3} radius={2} marginTop={3}>
            <Grid columns={2} gap={3}>
              <Stack space={2}>
                <Label size={0} muted>
                  Public ID
                </Label>
                <Text size={1} style={{wordBreak: 'break-all'}}>
                  {publicId}
                </Text>
              </Stack>
              <Stack space={2}>
                <Label size={0} muted>
                  Format
                </Label>
                <Text size={1}>
                  <Badge>{format.toUpperCase()}</Badge>
                </Text>
              </Stack>
              <Stack space={2}>
                <Label size={0} muted>
                  Dimensions
                </Label>
                <Text size={1}>
                  {value.width && value.height ? `${value.width} x ${value.height}` : 'Unknown'}
                </Text>
              </Stack>
              {value.bytes && (
                <Stack space={2}>
                  <Label size={0} muted>
                    File size
                  </Label>
                  <Text size={1}>{formatBytes(value.bytes)}</Text>
                </Stack>
              )}
              {uploadDate && (
                <Stack space={2}>
                  <Label size={0} muted>
                    Upload date
                  </Label>
                  <Text size={1}>{uploadDate}</Text>
                </Stack>
              )}
              {folder && (
                <Stack space={2}>
                  <Label size={0} muted>
                    Folder
                  </Label>
                  <Text size={1}>{folder}</Text>
                </Stack>
              )}
            </Grid>
          </Card>
        )}
      </Box>
    </Card>
  )
}
