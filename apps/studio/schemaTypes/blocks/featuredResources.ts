import {defineType, defineField, defineArrayMember} from 'sanity'
import {SearchIcon} from '@sanity/icons'

export const featuredResources = defineType({
  name: 'featuredResources',
  title: 'Featured Resources',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Community Resources',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'displayType',
      title: 'Display Type',
      type: 'string',
      options: {
        list: [
          {title: 'Featured Resources (manual selection)', value: 'manual'},
          {title: 'By Category', value: 'category'},
          {title: 'All Verified Resources', value: 'verified'},
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'resources',
      title: 'Featured Resources',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'communityResource'}]})],
      hidden: ({parent}) => parent?.displayType !== 'manual',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'resourceCategory'}],
      hidden: ({parent}) => parent?.displayType !== 'category',
    }),
    defineField({
      name: 'limit',
      title: 'Maximum Resources to Show',
      type: 'number',
      initialValue: 6,
      validation: (rule) => rule.min(1).max(12),
    }),
    defineField({
      name: 'showViewAll',
      title: 'Show "View All" Link',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'heading', displayType: 'displayType'},
    prepare({title, displayType}) {
      return {title: title || 'Featured Resources', subtitle: `Resources \u2022 ${displayType}`}
    },
  },
})
