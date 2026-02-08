import {useDocumentProjection, type DocumentHandle} from '@sanity/sdk-react'
import {CategoryBadge} from './CategoryBadge'

const PROJECTION = `{
  title,
  neighborhood,
  offerType,
  canTravel,
  "categoryTitles": categories[]->title,
  "categoryColors": categories[]->color
}`

interface OfferProjection {
  title: string
  neighborhood: string | null
  offerType: string | null
  canTravel: string | null
  categoryTitles: string[] | null
  categoryColors: string[] | null
}

const OFFER_TYPE_LABELS: Record<string, string> = {
  oneTime: 'One-time',
  recurring: 'Recurring',
  ongoing: 'Ongoing',
}

export function MatchingOfferItem(handle: DocumentHandle) {
  const {data} = useDocumentProjection<OfferProjection>({
    ...handle,
    projection: PROJECTION,
  })

  if (!data) return null

  return (
    <div className="matching-item matching-item--offer">
      <div className="matching-item__header">
        <span className="matching-item__title">{data.title}</span>
        {data.offerType && (
          <span className="matching-item__type">
            {OFFER_TYPE_LABELS[data.offerType] ?? data.offerType}
          </span>
        )}
      </div>
      <div className="matching-item__details">
        {data.categoryTitles?.map((title, i) => (
          <CategoryBadge
            key={title}
            title={title}
            color={data.categoryColors?.[i] ?? undefined}
          />
        ))}
        {data.neighborhood && (
          <span className="matching-item__location">{data.neighborhood}</span>
        )}
        {data.canTravel === 'yes' && (
          <span className="matching-item__travel">Can travel</span>
        )}
      </div>
    </div>
  )
}
