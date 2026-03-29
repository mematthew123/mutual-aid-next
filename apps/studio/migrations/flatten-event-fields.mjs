/**
 * Migration: Move flat event fields into nested location/registration objects
 *
 * Flat fields → Nested paths:
 *   locationType        → location.type
 *   virtualLink         → location.virtualLink
 *   registrationRequired → registration.required
 *   maxAttendees        → registration.capacity
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> node apps/studio/migrations/flatten-event-fields.mjs
 *
 * Run with --dry-run to preview changes without writing.
 */

const PROJECT_ID = '51mpsx72'
const DATASET = 'production'
const API_VERSION = '2024-01-01'
const TOKEN = process.env.SANITY_API_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')

if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN environment variable')
  process.exit(1)
}

const baseUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data`

async function query(groq) {
  const url = `${baseUrl}/query/${DATASET}?query=${encodeURIComponent(groq)}`
  const res = await fetch(url, {
    headers: {Authorization: `Bearer ${TOKEN}`},
  })
  const json = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(json))
  return json.result
}

async function mutate(mutations) {
  const url = `${baseUrl}/mutate/${DATASET}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({mutations}),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(json))
  return json
}

const docs = await query(`
  *[_type == "event" && (defined(locationType) || defined(maxAttendees) || defined(registrationRequired) || defined(virtualLink))]
  {_id, locationType, maxAttendees, registrationRequired, virtualLink, location, registration}
`)

console.log(`Found ${docs.length} event documents to migrate${DRY_RUN ? ' (dry run)' : ''}`)

if (docs.length === 0) {
  console.log('Nothing to migrate.')
  process.exit(0)
}

const mutations = []

for (const doc of docs) {
  const set = {}
  const unset = []

  // Migrate locationType → location.type
  if (doc.locationType != null) {
    set['location.type'] = doc.locationType
    unset.push('locationType')
  }

  // Migrate virtualLink → location.virtualLink
  if (doc.virtualLink != null) {
    set['location.virtualLink'] = doc.virtualLink
    unset.push('virtualLink')
  } else if ('virtualLink' in doc) {
    // Field exists but is null — just remove it
    unset.push('virtualLink')
  }

  // Migrate registrationRequired → registration.required
  if (doc.registrationRequired != null) {
    set['registration.required'] = doc.registrationRequired
    unset.push('registrationRequired')
  } else if ('registrationRequired' in doc) {
    unset.push('registrationRequired')
  }

  // Migrate maxAttendees → registration.capacity
  if (doc.maxAttendees != null) {
    set['registration.capacity'] = doc.maxAttendees
    unset.push('maxAttendees')
  } else if ('maxAttendees' in doc) {
    unset.push('maxAttendees')
  }

  // For docs where location is null, we need to ensure the object exists
  // before setting nested paths. Set an empty object first if needed.
  if (doc.location == null && ('location.type' in set || 'location.virtualLink' in set)) {
    const locationObj = {}
    if (set['location.type']) locationObj.type = set['location.type']
    if (set['location.virtualLink']) locationObj.virtualLink = set['location.virtualLink']
    // Replace nested sets with a full object set
    delete set['location.type']
    delete set['location.virtualLink']
    set.location = locationObj
  }

  // Same for registration
  if (doc.registration == null && ('registration.required' in set || 'registration.capacity' in set)) {
    const regObj = {}
    if ('registration.required' in set) {
      regObj.required = set['registration.required']
      delete set['registration.required']
    }
    if ('registration.capacity' in set) {
      regObj.capacity = set['registration.capacity']
      delete set['registration.capacity']
    }
    set.registration = regObj
  }

  const patch = {id: doc._id}
  if (Object.keys(set).length > 0) patch.set = set
  if (unset.length > 0) patch.unset = unset

  console.log(`  ${doc._id}:`)
  if (patch.set) console.log(`    set: ${JSON.stringify(patch.set)}`)
  if (patch.unset) console.log(`    unset: ${patch.unset.join(', ')}`)

  mutations.push({patch})
}

if (!DRY_RUN) {
  const result = await mutate(mutations)
  console.log(`\nMigration complete. ${result.results.length} documents patched.`)
} else {
  console.log(`\nDry run complete. ${mutations.length} patches would be applied.`)
}
