import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import {CloudinaryImageInput} from '../../plugins/cloudinary-asset-source/CloudinaryImageInput'

export const cloudinaryImage = defineType({
  name: 'cloudinaryImage',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'public_id',
      title: 'Public ID',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'number',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'number',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'number',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'bytes',
      title: 'File Size',
      type: 'number',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'gravity',
      title: 'Crop Focus',
      type: 'string',
      description: 'Where to focus when the image is cropped to fit a container',
      options: {
        list: [
          {title: 'Auto (AI detect)', value: 'auto'},
          {title: 'Face detection', value: 'face'},
          {title: 'Center', value: 'center'},
        ],
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for accessibility (recommended: 5–125 characters)',
      validation: (rule) => [
        rule.required().warning('Alt text is strongly recommended for accessibility'),
        rule.max(125).warning('Keep alt text under 125 characters'),
      ],
    }),
  ],
  components: {
    input: CloudinaryImageInput,
  },
  preview: {
    select: {
      public_id: 'public_id',
      format: 'format',
      alt: 'alt',
    },
    prepare({public_id, format, alt}) {
      return {
        title: alt || public_id || 'No image selected',
        subtitle: public_id ? `${public_id}.${format}` : undefined,
      }
    },
  },
})
