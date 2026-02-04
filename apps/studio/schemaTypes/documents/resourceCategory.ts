import {defineType, defineField} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const resourceCategory = defineType({
  name: 'resourceCategory',
  title: 'Resource Category',
  type: 'document',
  icon: TagIcon,
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon name for display (e.g., "food", "transport", "housing")',
      options: {
        list: [
          {title: 'Food & Groceries', value: 'food'},
          {title: 'Transportation', value: 'transport'},
          {title: 'Housing & Shelter', value: 'housing'},
          {title: 'Childcare', value: 'childcare'},
          {title: 'Medical & Health', value: 'medical'},
          {title: 'Mental Health', value: 'mentalHealth'},
          {title: 'Financial', value: 'financial'},
          {title: 'Legal', value: 'legal'},
          {title: 'Education & Tutoring', value: 'education'},
          {title: 'Technology & Internet', value: 'technology'},
          {title: 'Household Items', value: 'household'},
          {title: 'Clothing', value: 'clothing'},
          {title: 'Pet Care', value: 'petCare'},
          {title: 'Elder Care', value: 'elderCare'},
          {title: 'Translation & Language', value: 'translation'},
          {title: 'Employment', value: 'employment'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'color',
      title: 'Category Color',
      type: 'string',
      description: 'Color for visual distinction',
      options: {
        list: [
          {title: 'Red', value: 'red'},
          {title: 'Orange', value: 'orange'},
          {title: 'Yellow', value: 'yellow'},
          {title: 'Green', value: 'green'},
          {title: 'Blue', value: 'blue'},
          {title: 'Purple', value: 'purple'},
          {title: 'Pink', value: 'pink'},
          {title: 'Gray', value: 'gray'},
        ],
      },
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 100,
    }),
  ],
  preview: {
    select: {title: 'title', icon: 'icon'},
    prepare({title, icon}) {
      return {title, subtitle: icon}
    },
  },
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
})
