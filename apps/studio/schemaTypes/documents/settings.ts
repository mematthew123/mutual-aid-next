import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short description of your mutual aid network',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.email()}),
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({name: 'address', title: 'Address', type: 'text', rows: 3}),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({name: 'facebook', title: 'Facebook URL', type: 'url'}),
        defineField({name: 'instagram', title: 'Instagram URL', type: 'url'}),
        defineField({name: 'twitter', title: 'Twitter/X URL', type: 'url'}),
        defineField({name: 'tiktok', title: 'TikTok URL', type: 'url'}),
      ],
    }),
    defineField({
      name: 'serviceArea',
      title: 'Service Area',
      type: 'object',
      description: 'Geographic area your network serves',
      fields: [
        defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
        defineField({
          name: 'neighborhoods',
          title: 'Neighborhoods/Areas',
          type: 'array',
          of: [{type: 'string'}],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'logo'},
  },
})
