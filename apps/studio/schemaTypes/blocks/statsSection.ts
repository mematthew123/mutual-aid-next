import {defineType, defineField, defineArrayMember} from 'sanity'
import {ActivityIcon} from '@sanity/icons'

export const statsSection = defineType({
  name: 'statsSection',
  title: 'Stats Section',
  type: 'object',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Our Impact',
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g., "500+", "$10,000", "50"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g., "Families Helped", "Raised", "Volunteers"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'Optional additional context',
            }),
          ],
          preview: {
            select: {value: 'value', label: 'label'},
            prepare({value, label}) {
              return {title: value, subtitle: label}
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(6),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Highlight - Colored background', value: 'highlight'},
          {title: 'Subtle - Light background', value: 'subtle'},
          {title: 'Bordered - With cards', value: 'bordered'},
        ],
        layout: 'radio',
      },
      initialValue: 'highlight',
    }),
  ],
  preview: {
    select: {title: 'heading', stats: 'stats'},
    prepare({title, stats}) {
      const count = stats?.length || 0
      return {title: title || 'Stats Section', subtitle: `Stats \u2022 ${count} items`}
    },
  },
})
