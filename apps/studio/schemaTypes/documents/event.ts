import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          {title: 'Distribution - Food, supplies, etc.', value: 'distribution'},
          {title: 'Volunteer Day - Group action', value: 'volunteer'},
          {title: 'Meeting - Planning, community', value: 'meeting'},
          {title: 'Workshop - Training, skill-share', value: 'workshop'},
          {title: 'Fundraiser - Donation drive', value: 'fundraiser'},
          {title: 'Social - Community building', value: 'social'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = context.document?.startDateTime as string | undefined
          if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'isRecurring',
      title: 'Recurring Event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'recurrencePattern',
      title: 'Recurrence Pattern',
      type: 'string',
      options: {
        list: [
          {title: 'Weekly', value: 'weekly'},
          {title: 'Bi-weekly', value: 'biweekly'},
          {title: 'Monthly', value: 'monthly'},
          {title: 'First of month', value: 'firstOfMonth'},
          {title: 'Last of month', value: 'lastOfMonth'},
        ],
      },
      hidden: ({document}) => !document?.isRecurring,
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Location Type',
          type: 'string',
          options: {
            list: [
              {title: 'In-Person', value: 'inPerson'},
              {title: 'Virtual', value: 'virtual'},
              {title: 'Hybrid', value: 'hybrid'},
            ],
            layout: 'radio',
          },
          initialValue: 'inPerson',
        }),
        defineField({
          name: 'venue',
          title: 'Venue Name',
          type: 'string',
          hidden: ({parent}) => parent?.type === 'virtual',
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 2,
          hidden: ({parent}) => parent?.type === 'virtual',
        }),
        defineField({
          name: 'virtualLink',
          title: 'Virtual Meeting Link',
          type: 'url',
          hidden: ({parent}) => parent?.type === 'inPerson',
        }),
        defineField({
          name: 'accessibilityInfo',
          title: 'Accessibility Information',
          type: 'text',
          rows: 2,
          description: 'Wheelchair access, parking, transit, etc.',
        }),
      ],
    }),
    defineField({
      name: 'registration',
      title: 'Registration',
      type: 'object',
      fields: [
        defineField({
          name: 'required',
          title: 'Registration Required',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'link',
          title: 'Registration Link',
          type: 'url',
          hidden: ({parent}) => !parent?.required,
        }),
        defineField({
          name: 'deadline',
          title: 'Registration Deadline',
          type: 'datetime',
          hidden: ({parent}) => !parent?.required,
        }),
        defineField({
          name: 'capacity',
          title: 'Max Capacity',
          type: 'number',
          hidden: ({parent}) => !parent?.required,
        }),
      ],
    }),
    defineField({
      name: 'volunteersNeeded',
      title: 'Volunteers Needed',
      type: 'number',
      description: 'Number of volunteers needed (0 if not applicable)',
      initialValue: 0,
    }),
    defineField({
      name: 'volunteerRoles',
      title: 'Volunteer Roles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'role', title: 'Role', type: 'string'}),
            defineField({name: 'count', title: 'Number Needed', type: 'number'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
          ],
          preview: {
            select: {title: 'role', count: 'count'},
            prepare({title, count}) {
              return {title, subtitle: `${count || 0} needed`}
            },
          },
        }),
      ],
      hidden: ({document}) => !document?.volunteersNeeded || document.volunteersNeeded === 0,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft - Not published', value: 'draft'},
          {title: 'Published - Visible on site', value: 'published'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Postponed', value: 'postponed'},
          {title: 'Completed', value: 'completed'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'contactPerson',
      title: 'Contact Person',
      type: 'reference',
      to: [{type: 'teamMember'}],
    }),
    defineField({
      name: 'relatedCategories',
      title: 'Related Resource Categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'resourceCategory'}]})],
      description: 'Categories of resources involved in this event',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'startDateTime',
      eventType: 'eventType',
      status: 'status',
      media: 'image',
    },
    prepare({title, date, eventType, status, media}) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date'
      return {
        title,
        subtitle: `${eventType || 'event'} \u2022 ${formattedDate} \u2022 ${status}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Event Date',
      name: 'dateAsc',
      by: [{field: 'startDateTime', direction: 'asc'}],
    },
  ],
})
