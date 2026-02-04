import {defineType, defineField, defineArrayMember} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Frequently Asked Questions',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: [defineArrayMember({type: 'block'})],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'question'},
            prepare({title}) {
              return {title}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'showContactCta',
      title: 'Show "Still have questions?" CTA',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'contactCtaText',
      title: 'Contact CTA Text',
      type: 'string',
      initialValue: "Still have questions? We're here to help.",
      hidden: ({parent}) => !parent?.showContactCta,
    }),
  ],
  preview: {
    select: {title: 'heading', faqs: 'faqs'},
    prepare({title, faqs}) {
      const count = faqs?.length || 0
      return {title: title || 'FAQ Section', subtitle: `FAQ \u2022 ${count} questions`}
    },
  },
})
