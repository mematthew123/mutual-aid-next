// Documents
import {settings} from './documents/settings'
import {page} from './documents/page'
import {resourceRequest} from './documents/resourceRequest'
import {resourceOffer} from './documents/resourceOffer'
import {resourceCategory} from './documents/resourceCategory'
import {event} from './documents/event'
import {communityResource} from './documents/communityResource'
import {teamMember} from './documents/teamMember'
import {donationCampaign} from './documents/donationCampaign'

// Objects
import {seo} from './objects/seo'
import {cloudinaryImage} from './objects/cloudinaryImage'

// Page Builder Blocks
import {hero} from './blocks/hero'
import {textSection} from './blocks/textSection'
import {callToAction} from './blocks/callToAction'
import {featuredResources} from './blocks/featuredResources'
import {upcomingEvents} from './blocks/upcomingEvents'
import {faqSection} from './blocks/faqSection'
import {teamSection} from './blocks/teamSection'
import {statsSection} from './blocks/statsSection'

export const schemaTypes = [
  // Documents
  settings,
  page,
  resourceRequest,
  resourceOffer,
  resourceCategory,
  event,
  communityResource,
  teamMember,
  donationCampaign,

  // Objects
  seo,
  cloudinaryImage,

  // Page Builder Blocks
  hero,
  textSection,
  callToAction,
  featuredResources,
  upcomingEvents,
  faqSection,
  teamSection,
  statsSection,
]
