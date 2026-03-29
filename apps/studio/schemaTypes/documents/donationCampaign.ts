import {defineType, defineField, defineArrayMember} from 'sanity'
import {CreditCardIcon} from '@sanity/icons'

export const donationCampaign = defineType({
  name: 'donationCampaign',
  title: 'Donation Campaign',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Campaign Title',
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
      name: 'campaignType',
      title: 'Campaign Type',
      type: 'string',
      options: {
        list: [
          {title: 'General Fund', value: 'general'},
          {title: 'Emergency Relief', value: 'emergency'},
          {title: 'Specific Cause', value: 'specific'},
          {title: 'Recurring/Monthly', value: 'recurring'},
        ],
        layout: 'radio',
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'image',
      title: 'Campaign Image',
      type: 'cloudinaryImage',
    }),
    defineField({
      name: 'goal',
      title: 'Fundraising Goal',
      type: 'object',
      fields: [
        defineField({
          name: 'hasGoal',
          title: 'Has Specific Goal',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'amount',
          title: 'Goal Amount',
          type: 'number',
          hidden: ({parent}) => !parent?.hasGoal,
        }),
        defineField({
          name: 'currentAmount',
          title: 'Current Amount Raised',
          type: 'number',
          description: 'Update this as donations come in',
          initialValue: 0,
        }),
        defineField({
          name: 'showProgress',
          title: 'Show Progress Bar',
          type: 'boolean',
          initialValue: true,
          hidden: ({parent}) => !parent?.hasGoal,
        }),
      ],
    }),
    defineField({
      name: 'timeline',
      title: 'Campaign Timeline',
      type: 'object',
      fields: [
        defineField({
          name: 'startDate',
          title: 'Start Date',
          type: 'date',
        }),
        defineField({
          name: 'endDate',
          title: 'End Date',
          type: 'date',
          description: 'Leave blank for ongoing campaigns',
        }),
        defineField({
          name: 'isOngoing',
          title: 'Ongoing Campaign',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'donationOptions',
      title: 'Suggested Donation Amounts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'amount', title: 'Amount', type: 'number'}),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g., "Provides meals for a family"',
            }),
          ],
          preview: {
            select: {amount: 'amount', label: 'label'},
            prepare({amount, label}) {
              return {
                title: `$${amount}`,
                subtitle: label,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'donationLinks',
      title: 'Donation Links',
      type: 'object',
      fields: [
        defineField({name: 'venmo', title: 'Venmo Handle', type: 'string'}),
        defineField({name: 'cashapp', title: 'CashApp Handle', type: 'string'}),
        defineField({name: 'paypal', title: 'PayPal Link', type: 'url'}),
        defineField({name: 'gofundme', title: 'GoFundMe Link', type: 'url'}),
        defineField({name: 'other', title: 'Other Donation Link', type: 'url'}),
        defineField({name: 'otherLabel', title: 'Other Link Label', type: 'string'}),
      ],
    }),
    defineField({
      name: 'acceptsInKind',
      title: 'Accepts In-Kind Donations',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inKindNeeds',
      title: 'In-Kind Donation Needs',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({document}) => !document?.acceptsInKind,
      description: 'List items needed (e.g., "Canned goods", "Winter coats")',
    }),
    defineField({
      name: 'dropOffInfo',
      title: 'Drop-Off Information',
      type: 'text',
      rows: 3,
      hidden: ({document}) => !document?.acceptsInKind,
      description: 'Where and when to drop off in-kind donations',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Active', value: 'active'},
          {title: 'Goal Reached', value: 'goalReached'},
          {title: 'Ended', value: 'ended'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Campaign',
      type: 'boolean',
      initialValue: false,
      description: 'Show prominently on homepage',
    }),
    defineField({
      name: 'updates',
      title: 'Campaign Updates',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'date', title: 'Date', type: 'date'}),
            defineField({name: 'title', title: 'Update Title', type: 'string'}),
            defineField({
              name: 'content',
              title: 'Update Content',
              type: 'array',
              of: [defineArrayMember({type: 'block'})],
            }),
          ],
          preview: {
            select: {title: 'title', date: 'date'},
            prepare({title, date}) {
              return {
                title,
                subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      goal: 'goal.amount',
      current: 'goal.currentAmount',
    },
    prepare({title, status, goal, current}) {
      const progress = goal ? `$${current || 0} / $${goal}` : 'No goal set'
      return {
        title,
        subtitle: `${status} \u2022 ${progress}`,
      }
    },
  },
})
