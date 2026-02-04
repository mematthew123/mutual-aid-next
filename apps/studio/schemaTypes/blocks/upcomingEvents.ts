import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const upcomingEvents = defineType({
  name: 'upcomingEvents',
  title: 'Upcoming Events',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Upcoming Events',
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
          {title: 'Next Upcoming Events (automatic)', value: 'automatic'},
          {title: 'Featured Events (manual selection)', value: 'manual'},
          {title: 'By Event Type', value: 'byType'},
        ],
        layout: 'radio',
      },
      initialValue: 'automatic',
    }),
    defineField({
      name: 'events',
      title: 'Featured Events',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'event'}]})],
      hidden: ({parent}) => parent?.displayType !== 'manual',
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          {title: 'Distribution', value: 'distribution'},
          {title: 'Volunteer', value: 'volunteer'},
          {title: 'Meeting', value: 'meeting'},
          {title: 'Workshop', value: 'workshop'},
          {title: 'Fundraiser', value: 'fundraiser'},
          {title: 'Social', value: 'social'},
        ],
      },
      hidden: ({parent}) => parent?.displayType !== 'byType',
    }),
    defineField({
      name: 'limit',
      title: 'Maximum Events to Show',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.min(1).max(10),
    }),
    defineField({
      name: 'showViewAll',
      title: 'Show "View All Events" Link',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Cards - Grid of event cards', value: 'cards'},
          {title: 'List - Compact list view', value: 'list'},
          {title: 'Calendar - Mini calendar view', value: 'calendar'},
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
    }),
  ],
  preview: {
    select: {title: 'heading', displayType: 'displayType'},
    prepare({title, displayType}) {
      return {title: title || 'Upcoming Events', subtitle: `Events \u2022 ${displayType}`}
    },
  },
})
