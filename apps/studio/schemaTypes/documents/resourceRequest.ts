import {defineType, defineField, defineArrayMember} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const resourceRequest = defineType({
  name: 'resourceRequest',
  title: 'Resource Request',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Request Title',
      type: 'string',
      description: 'Brief description of what is needed',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'resourceCategory'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Detailed description of the need',
    }),
    defineField({
      name: 'urgency',
      title: 'Urgency Level',
      type: 'string',
      options: {
        list: [
          {title: 'Low - Can wait a week or more', value: 'low'},
          {title: 'Medium - Needed within a few days', value: 'medium'},
          {title: 'High - Needed within 24-48 hours', value: 'high'},
          {title: 'Critical - Immediate need', value: 'critical'},
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Open - Seeking help', value: 'open'},
          {title: 'In Progress - Help is on the way', value: 'inProgress'},
          {title: 'Fulfilled - Need has been met', value: 'fulfilled'},
          {title: 'Closed - No longer needed', value: 'closed'},
        ],
        layout: 'radio',
      },
      initialValue: 'open',
    }),
    defineField({
      name: 'neighborhood',
      title: 'Neighborhood/Area',
      type: 'string',
      description: 'General area (for privacy, do not include exact address)',
    }),
    defineField({
      name: 'contactMethod',
      title: 'Preferred Contact Method',
      type: 'string',
      options: {
        list: [
          {title: 'Through the network coordinator', value: 'coordinator'},
          {title: 'Direct contact (will provide details)', value: 'direct'},
        ],
        layout: 'radio',
      },
      initialValue: 'coordinator',
    }),
    defineField({
      name: 'isPublic',
      title: 'Visibility',
      type: 'string',
      options: {
        list: [
          {title: 'Public - Show on website', value: 'public'},
          {title: 'Private - Coordinators only', value: 'private'},
        ],
        layout: 'radio',
      },
      initialValue: 'public',
      description: 'Private requests are only visible to network coordinators',
    }),
    defineField({
      name: 'dateNeeded',
      title: 'Date Needed By',
      type: 'date',
    }),
    defineField({
      name: 'fulfilledBy',
      title: 'Fulfilled By',
      type: 'reference',
      to: [{type: 'resourceOffer'}],
      hidden: ({document}) => document?.status !== 'fulfilled',
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
      category: 'category.title',
      status: 'status',
      urgency: 'urgency',
    },
    prepare({title, category, status, urgency}) {
      const urgencyEmoji = {
        low: '',
        medium: '',
        high: '\u26A0\uFE0F',
        critical: '\uD83D\uDD34',
      }
      return {
        title: `${urgencyEmoji[urgency as keyof typeof urgencyEmoji] || ''} ${title}`.trim(),
        subtitle: `${category || 'Uncategorized'} \u2022 ${status || 'open'}`,
      }
    },
  },
  orderings: [
    {
      title: 'Urgency',
      name: 'urgencyDesc',
      by: [{field: 'urgency', direction: 'desc'}],
    },
    {
      title: 'Newest First',
      name: 'createdDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
  ],
})
