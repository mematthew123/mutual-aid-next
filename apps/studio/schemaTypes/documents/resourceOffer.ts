import {defineType, defineField, defineArrayMember} from 'sanity'
import {HeartIcon} from '@sanity/icons'

export const resourceOffer = defineType({
  name: 'resourceOffer',
  title: 'Resource Offer',
  type: 'document',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Offer Title',
      type: 'string',
      description: 'Brief description of what you can offer',
      validation: (rule) => rule.required().max(100),
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
      description: 'Detailed description of what you can provide',
    }),
    defineField({
      name: 'offerType',
      title: 'Offer Type',
      type: 'string',
      options: {
        list: [
          {title: 'One-time - Available once', value: 'oneTime'},
          {title: 'Recurring - Can help regularly', value: 'recurring'},
          {title: 'Ongoing - Always available', value: 'ongoing'},
        ],
        layout: 'radio',
      },
      initialValue: 'oneTime',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'object',
      fields: [
        defineField({
          name: 'days',
          title: 'Days Available',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Monday', value: 'monday'},
              {title: 'Tuesday', value: 'tuesday'},
              {title: 'Wednesday', value: 'wednesday'},
              {title: 'Thursday', value: 'thursday'},
              {title: 'Friday', value: 'friday'},
              {title: 'Saturday', value: 'saturday'},
              {title: 'Sunday', value: 'sunday'},
            ],
          },
        }),
        defineField({
          name: 'timeRange',
          title: 'Time Range',
          type: 'string',
          description: 'e.g., "Mornings", "9am-5pm", "Evenings after 6pm"',
        }),
        defineField({
          name: 'notes',
          title: 'Availability Notes',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'neighborhood',
      title: 'Neighborhood/Area',
      type: 'string',
      description: 'Area where you can provide help',
    }),
    defineField({
      name: 'canTravel',
      title: 'Can Travel',
      type: 'string',
      options: {
        list: [
          {title: 'Yes - I can come to you', value: 'yes'},
          {title: 'Limited - Within my neighborhood', value: 'limited'},
          {title: 'No - Must come to me', value: 'no'},
        ],
        layout: 'radio',
      },
      initialValue: 'limited',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Active - Available to help', value: 'active'},
          {title: 'Paused - Temporarily unavailable', value: 'paused'},
          {title: 'Fulfilled - No longer offering', value: 'fulfilled'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'expirationDate',
      title: 'Offer Expiration Date',
      type: 'date',
      description: 'When this offer expires (leave blank for ongoing offers)',
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
      title: 'title',
      status: 'status',
      offerType: 'offerType',
    },
    prepare({title, status, offerType}) {
      return {
        title,
        subtitle: `${offerType || 'one-time'} \u2022 ${status || 'active'}`,
      }
    },
  },
})
