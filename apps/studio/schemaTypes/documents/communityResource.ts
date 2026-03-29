import {defineType, defineField, defineArrayMember} from 'sanity'
import {PinIcon} from '@sanity/icons'

export const communityResource = defineType({
  name: 'communityResource',
  title: 'Community Resource',
  type: 'document',
  icon: PinIcon,
  description: 'External organizations, services, and resources in the community',
  fields: [
    defineField({
      name: 'name',
      title: 'Organization/Resource Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'resourceCategory'}]})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'What services does this resource provide?',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'cloudinaryImage',
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.email()}),
        defineField({name: 'website', title: 'Website', type: 'url'}),
        defineField({name: 'address', title: 'Address', type: 'text', rows: 2}),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Hours of Operation',
      type: 'text',
      rows: 3,
      description: 'When is this resource available?',
    }),
    defineField({
      name: 'eligibility',
      title: 'Eligibility Requirements',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Who can access this resource? Any requirements?',
    }),
    defineField({
      name: 'howToAccess',
      title: 'How to Access',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Steps to access this resource',
    }),
    defineField({
      name: 'languages',
      title: 'Languages Supported',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: 'Spanish', value: 'es'},
          {title: 'Mandarin', value: 'zh'},
          {title: 'Vietnamese', value: 'vi'},
          {title: 'Korean', value: 'ko'},
          {title: 'Tagalog', value: 'tl'},
          {title: 'Arabic', value: 'ar'},
          {title: 'Russian', value: 'ru'},
          {title: 'French', value: 'fr'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'accessibility',
      title: 'Accessibility Features',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Wheelchair Accessible', value: 'wheelchair'},
          {title: 'ASL Interpretation Available', value: 'asl'},
          {title: 'TTY/TDD', value: 'tty'},
          {title: 'Large Print Materials', value: 'largePrint'},
          {title: 'Screen Reader Compatible Website', value: 'screenReader'},
          {title: 'Service Animals Welcome', value: 'serviceAnimals'},
        ],
      },
    }),
    defineField({
      name: 'serviceArea',
      title: 'Service Area',
      type: 'string',
      description: 'Geographic area served',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Resource',
      type: 'boolean',
      initialValue: false,
      description: 'Show this resource prominently',
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified',
      type: 'boolean',
      initialValue: false,
      description: 'Has this resource been verified by a coordinator?',
    }),
    defineField({
      name: 'lastVerified',
      title: 'Last Verified Date',
      type: 'date',
      hidden: ({document}) => !document?.isVerified,
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Notes for coordinators (not shown publicly)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      category: 'categories.0.title',
      verified: 'isVerified',
    },
    prepare({title, category, verified}) {
      return {
        title: `${verified ? '\u2705 ' : ''}${title}`,
        subtitle: category || 'Uncategorized',
      }
    },
  },
})
