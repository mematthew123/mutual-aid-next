export interface TransformationPreset {
  key: string
  label: string
  width: number
  height: number
  crop: string
  gravity?: string
}

export const TRANSFORMATION_PRESETS: TransformationPreset[] = [
  {key: 'eventCard', label: 'Event Card', width: 600, height: 400, crop: 'fill', gravity: 'auto'},
  {key: 'hero', label: 'Hero Banner', width: 1920, height: 800, crop: 'fill', gravity: 'auto'},
  {key: 'teamPhoto', label: 'Team Photo', width: 400, height: 400, crop: 'fill', gravity: 'face'},
  {
    key: 'resourceLogo',
    label: 'Resource Logo',
    width: 200,
    height: 200,
    crop: 'limit',
  },
  {key: 'ogImage', label: 'Social/OG', width: 1200, height: 630, crop: 'fill', gravity: 'auto'},
]

export function buildPresetTransforms(preset: TransformationPreset): string {
  const parts = [`c_${preset.crop}`, `w_${preset.width}`, `h_${preset.height}`]
  if (preset.gravity) parts.push(`g_${preset.gravity}`)
  parts.push('f_auto', 'q_auto')
  return parts.join(',')
}
