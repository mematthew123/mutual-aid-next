import {useCallback, useState} from 'react'
import {Button, Card, Flex, Spinner, Stack, Text, useToast} from '@sanity/ui'
import {ImageIcon, UploadIcon} from '@sanity/icons'
import styled from 'styled-components'
import {CloudinaryIcon} from './CloudinaryIcon'
import {getCloudName, getUploadPreset} from './utils'

const DropZone = styled(Card)<{$isDragOver: boolean}>`
  border-style: ${({$isDragOver}) => ($isDragOver ? 'solid' : 'dashed')};
  border-width: 2px;
  transition:
    border-color 0.15s,
    background-color 0.15s;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
`

interface EmptyStateProps {
  loaded: boolean
  widgetOpen: boolean
  onBrowse: () => void
  onUploadComplete: (data: {
    public_id: string
    format: string
    width: number
    height: number
    version: number
    bytes: number
  }) => void
}

export function EmptyState({loaded, widgetOpen, onBrowse, onUploadComplete}: EmptyStateProps) {
  const toast = useToast()
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const uploadPreset = getUploadPreset()
  const canUpload = !!uploadPreset

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (canUpload) setIsDragOver(true)
    },
    [canUpload],
  )

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      if (!canUpload) return

      const file = e.dataTransfer.files[0]
      if (!file || !file.type.startsWith('image/')) {
        toast.push({
          status: 'warning',
          title: 'Invalid file',
          description: 'Please drop an image file (JPEG, PNG, WebP, etc.)',
          closable: true,
        })
        return
      }

      const cloudName = getCloudName()
      if (!cloudName) return

      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', uploadPreset)

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {method: 'POST', body: formData},
        )

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error?.message || `Upload failed (${res.status})`)
        }

        const data = await res.json()
        onUploadComplete({
          public_id: data.public_id,
          format: data.format,
          width: data.width,
          height: data.height,
          version: data.version,
          bytes: data.bytes,
        })
      } catch (err) {
        toast.push({
          status: 'error',
          title: 'Upload failed',
          description: err instanceof Error ? err.message : 'An unexpected error occurred.',
          closable: true,
        })
      } finally {
        setIsUploading(false)
      }
    },
    [canUpload, uploadPreset, onUploadComplete, toast],
  )

  if (isUploading) {
    return (
      <Card padding={5} radius={2} border tone="transparent">
        <Flex direction="column" align="center" justify="center" gap={3} style={{minHeight: 200}}>
          <Spinner muted />
          <Text size={1} muted>
            Uploading...
          </Text>
        </Flex>
      </Card>
    )
  }

  return (
    <DropZone
      padding={5}
      radius={2}
      tone={isDragOver ? 'primary' : 'transparent'}
      $isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Stack space={4} style={{textAlign: 'center'}}>
        <Text size={4} muted>
          <CloudinaryIcon />
        </Text>
        <Text size={2} weight="semibold">
          {isDragOver ? 'Drop to upload' : 'Select or drop an image'}
        </Text>
        <Text size={1} muted>
          {isDragOver
            ? 'Release to start uploading'
            : canUpload
              ? 'Browse your Cloudinary library or drag a file to upload'
              : 'Browse your Cloudinary media library'}
        </Text>
        {!isDragOver && (
          <Flex gap={3} justify="center">
            <Button
              icon={ImageIcon}
              text="Browse Library"
              tone="primary"
              onClick={onBrowse}
              disabled={!loaded || widgetOpen}
            />
            {canUpload && (
              <Button
                icon={UploadIcon}
                text="Upload"
                mode="ghost"
                onClick={onBrowse}
                disabled={!loaded || widgetOpen}
              />
            )}
          </Flex>
        )}
      </Stack>
    </DropZone>
  )
}
