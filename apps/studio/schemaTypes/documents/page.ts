import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'pageBuilder',
      title: 'Page Content',
      type: 'array',
      of: [
        defineArrayMember({type: 'hero'}),
        defineArrayMember({type: 'textSection'}),
        defineArrayMember({type: 'callToAction'}),
        defineArrayMember({type: 'featuredResources'}),
        defineArrayMember({type: 'upcomingEvents'}),
        defineArrayMember({type: 'faqSection'}),
        defineArrayMember({type: 'teamSection'}),
        defineArrayMember({type: 'statsSection'}),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare({title, slug}) {
      return {title, subtitle: `/${slug || ''}`}
    },
  },
})
