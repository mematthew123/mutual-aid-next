import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'branding', title: 'Branding', default: true},
    {name: 'hero', title: 'Homepage'},
    {name: 'terminology', title: 'Terminology'},
    {name: 'impact', title: 'Impact Stats'},
    {name: 'contact', title: 'Contact'},
    {name: 'social', title: 'Social'},
    {name: 'serviceArea', title: 'Service Area'},
  ],
  fields: [
    // =========================================================================
    // Branding
    // =========================================================================
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'The full name of your organization (e.g. "Mutual Aid Network")',
      validation: (rule) => rule.required(),
      group: 'branding',
    }),
    defineField({
      name: 'shortName',
      title: 'Short Name',
      type: 'string',
      description: 'Abbreviated name shown in the header (e.g. "Mutual Aid")',
      group: 'branding',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short description shown in the footer and metadata',
      group: 'branding',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      description: 'Used in SEO metadata — describe what your organization does',
      group: 'branding',
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer Note',
      type: 'string',
      description: 'Small text at the bottom of the footer (e.g. "Built with love for your community")',
      group: 'branding',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      group: 'branding',
    }),

    // =========================================================================
    // Homepage
    // =========================================================================
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'badge',
          title: 'Badge Text',
          type: 'string',
          description: 'Small label above the heading (e.g. "Community Support Network")',
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          description: 'Main heading text (the accent portion is separate)',
        }),
        defineField({
          name: 'headingAccent',
          title: 'Heading Accent',
          type: 'string',
          description: 'The highlighted/colored portion of the heading',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'ctaPrimary',
          title: 'Primary Button Text',
          type: 'string',
          description: 'e.g. "I Need Help"',
        }),
        defineField({
          name: 'ctaSecondary',
          title: 'Secondary Button Text',
          type: 'string',
          description: 'e.g. "I Can Help"',
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action Section',
      type: 'object',
      description: 'Bottom-of-page call to action on the homepage',
      group: 'hero',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
        defineField({name: 'primaryAction', title: 'Primary Button Text', type: 'string'}),
        defineField({name: 'secondaryAction', title: 'Secondary Button Text', type: 'string'}),
      ],
    }),

    // =========================================================================
    // Terminology
    // =========================================================================
    defineField({
      name: 'terminology',
      title: 'Terminology',
      type: 'object',
      description: 'Customize the language used throughout the site to match your organization',
      group: 'terminology',
      fields: [
        defineField({
          name: 'member',
          title: 'Member (singular)',
          type: 'string',
          description: 'What you call people in your community (e.g. "neighbor", "community member", "resident")',
        }),
        defineField({
          name: 'members',
          title: 'Members (plural)',
          type: 'string',
        }),
        defineField({
          name: 'organizer',
          title: 'Organizer (singular)',
          type: 'string',
          description: 'What you call coordinators/moderators (e.g. "organizer", "coordinator", "admin")',
        }),
        defineField({
          name: 'organizers',
          title: 'Organizers (plural)',
          type: 'string',
        }),
        defineField({
          name: 'helper',
          title: 'Helper (singular)',
          type: 'string',
          description: 'What you call people who help (e.g. "volunteer", "helper", "contributor")',
        }),
        defineField({
          name: 'helpers',
          title: 'Helpers (plural)',
          type: 'string',
        }),
        defineField({
          name: 'helping',
          title: 'Helping (gerund)',
          type: 'string',
          description: 'The act of helping (e.g. "volunteering", "helping", "contributing")',
        }),
      ],
    }),

    // =========================================================================
    // Impact Stats
    // =========================================================================
    defineField({
      name: 'impactStats',
      title: 'Impact Stats',
      type: 'array',
      description: 'Key numbers displayed on the homepage. Leave empty to use defaults.',
      group: 'impact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'value', title: 'Value', type: 'string', validation: (rule) => rule.required()}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'value'},
          },
        },
      ],
      validation: (rule) => rule.max(4),
    }),

    // =========================================================================
    // Contact
    // =========================================================================
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.email()}),
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({name: 'address', title: 'Address', type: 'text', rows: 3}),
      ],
    }),

    // =========================================================================
    // Social
    // =========================================================================
    defineField({
      name: 'social',
      title: 'Social Media Links',
      type: 'object',
      group: 'social',
      fields: [
        defineField({name: 'facebook', title: 'Facebook URL', type: 'url'}),
        defineField({name: 'instagram', title: 'Instagram URL', type: 'url'}),
        defineField({name: 'twitter', title: 'Twitter/X URL', type: 'url'}),
        defineField({name: 'tiktok', title: 'TikTok URL', type: 'url'}),
      ],
    }),

    // =========================================================================
    // Service Area
    // =========================================================================
    defineField({
      name: 'serviceArea',
      title: 'Service Area',
      type: 'object',
      description: 'Geographic area your network serves',
      group: 'serviceArea',
      fields: [
        defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
        defineField({
          name: 'neighborhoods',
          title: 'Neighborhoods/Areas',
          type: 'array',
          of: [{type: 'string'}],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', media: 'logo'},
  },
})
