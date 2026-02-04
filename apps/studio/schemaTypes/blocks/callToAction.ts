import {defineType, defineField} from 'sanity'
import {LaunchIcon} from '@sanity/icons'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal Page', value: 'internal'},
          {title: 'External URL', value: 'external'},
          {title: 'Request Form', value: 'requestForm'},
          {title: 'Offer Form', value: 'offerForm'},
          {title: 'Donate', value: 'donate'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Page',
      type: 'reference',
      to: [{type: 'page'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
    defineField({
      name: 'donationCampaign',
      title: 'Donation Campaign',
      type: 'reference',
      to: [{type: 'donationCampaign'}],
      hidden: ({parent}) => parent?.linkType !== 'donate',
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Highlight - Colored background', value: 'highlight'},
          {title: 'Subtle - Light background', value: 'subtle'},
          {title: 'Bordered - With border', value: 'bordered'},
        ],
        layout: 'radio',
      },
      initialValue: 'highlight',
    }),
  ],
  preview: {
    select: {title: 'heading', linkType: 'linkType'},
    prepare({title, linkType}) {
      return {title: title || 'Call to Action', subtitle: `CTA \u2022 ${linkType}`}
    },
  },
})
