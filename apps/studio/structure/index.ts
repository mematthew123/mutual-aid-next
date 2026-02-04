import type {StructureResolver} from 'sanity/structure'
import {
  CogIcon,
  DocumentIcon,
  HelpCircleIcon,
  HeartIcon,
  CalendarIcon,
  PinIcon,
  UsersIcon,
  CreditCardIcon,
  TagIcon,
  HomeIcon,
} from '@sanity/icons'

// Singleton document types - these get special treatment
const SINGLETONS = ['settings']

// Helper to create singleton list items
const createSingleton = (
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
  icon?: React.ComponentType
) => {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Mutual Aid Network')
    .items([
      // Settings (Singleton)
      createSingleton(S, 'settings', 'Site Settings', CogIcon),

      S.divider(),

      // Pages
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),

      S.divider(),

      // Mutual Aid - Requests & Offers
      S.listItem()
        .title('Mutual Aid')
        .icon(HeartIcon)
        .child(
          S.list()
            .title('Mutual Aid')
            .items([
              S.listItem()
                .title('All Requests')
                .icon(HelpCircleIcon)
                .child(
                  S.documentTypeList('resourceRequest')
                    .title('All Requests')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Open Requests')
                .icon(HelpCircleIcon)
                .child(
                  S.documentList()
                    .title('Open Requests')
                    .filter('_type == "resourceRequest" && status == "open"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Urgent Requests')
                .icon(HelpCircleIcon)
                .child(
                  S.documentList()
                    .title('Urgent Requests')
                    .filter(
                      '_type == "resourceRequest" && (urgency == "high" || urgency == "critical") && status == "open"'
                    )
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              S.divider(),
              S.listItem()
                .title('All Offers')
                .icon(HeartIcon)
                .child(
                  S.documentTypeList('resourceOffer')
                    .title('All Offers')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('Active Offers')
                .icon(HeartIcon)
                .child(
                  S.documentList()
                    .title('Active Offers')
                    .filter('_type == "resourceOffer" && status == "active"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
            ])
        ),

      // Events
      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('All Events')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('All Events')
                    .defaultOrdering([{field: 'startDateTime', direction: 'asc'}])
                ),
              S.listItem()
                .title('Upcoming Events')
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title('Upcoming Events')
                    .filter(
                      '_type == "event" && startDateTime > now() && status == "published"'
                    )
                    .defaultOrdering([{field: 'startDateTime', direction: 'asc'}])
                ),
              S.listItem()
                .title('Draft Events')
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title('Draft Events')
                    .filter('_type == "event" && status == "draft"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
            ])
        ),

      // Resource Directory
      S.listItem()
        .title('Resource Directory')
        .icon(PinIcon)
        .child(
          S.list()
            .title('Resource Directory')
            .items([
              S.listItem()
                .title('All Resources')
                .icon(PinIcon)
                .child(
                  S.documentTypeList('communityResource').title('All Community Resources')
                ),
              S.listItem()
                .title('Featured Resources')
                .icon(PinIcon)
                .child(
                  S.documentList()
                    .title('Featured Resources')
                    .filter('_type == "communityResource" && isFeatured == true')
                ),
              S.listItem()
                .title('Needs Verification')
                .icon(PinIcon)
                .child(
                  S.documentList()
                    .title('Needs Verification')
                    .filter('_type == "communityResource" && isVerified != true')
                ),
            ])
        ),

      // Donations
      S.listItem()
        .title('Donations')
        .icon(CreditCardIcon)
        .child(
          S.list()
            .title('Donations')
            .items([
              S.listItem()
                .title('All Campaigns')
                .icon(CreditCardIcon)
                .child(S.documentTypeList('donationCampaign').title('All Campaigns')),
              S.listItem()
                .title('Active Campaigns')
                .icon(CreditCardIcon)
                .child(
                  S.documentList()
                    .title('Active Campaigns')
                    .filter('_type == "donationCampaign" && status == "active"')
                ),
            ])
        ),

      S.divider(),

      // Team
      S.listItem()
        .title('Team')
        .icon(UsersIcon)
        .child(
          S.documentTypeList('teamMember')
            .title('Team Members')
            .defaultOrdering([{field: 'sortOrder', direction: 'asc'}])
        ),

      // Categories
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(
          S.documentTypeList('resourceCategory')
            .title('Resource Categories')
            .defaultOrdering([{field: 'sortOrder', direction: 'asc'}])
        ),
    ])
