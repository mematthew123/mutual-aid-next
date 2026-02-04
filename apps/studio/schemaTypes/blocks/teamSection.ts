import {defineType, defineField, defineArrayMember} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const teamSection = defineType({
  name: 'teamSection',
  title: 'Team Section',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Our Team',
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
          {title: 'All Active Team Members', value: 'all'},
          {title: 'Selected Team Members', value: 'selected'},
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'teamMember'}]})],
      hidden: ({parent}) => parent?.displayType !== 'selected',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid - Photo cards', value: 'grid'},
          {title: 'List - Compact with photos', value: 'list'},
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'showBio',
      title: 'Show Bios',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'heading', displayType: 'displayType'},
    prepare({title, displayType}) {
      return {title: title || 'Team Section', subtitle: `Team \u2022 ${displayType}`}
    },
  },
})
