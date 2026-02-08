import {useDocumentProjection, type DocumentHandle} from '@sanity/sdk-react'
import {UrgencyBadge} from './UrgencyBadge'
import {CategoryBadge} from './CategoryBadge'

const PROJECTION = `{
  title,
  urgency,
  neighborhood,
  dateNeeded,
  "categoryTitle": category->title,
  "categoryColor": category->color
}`

interface RequestProjection {
  title: string
  urgency: string
  neighborhood: string | null
  dateNeeded: string | null
  categoryTitle: string | null
  categoryColor: string | null
}

export function MatchingRequestItem(handle: DocumentHandle) {
  const {data} = useDocumentProjection<RequestProjection>({
    ...handle,
    projection: PROJECTION,
  })

  if (!data) return null

  return (
    <div className="matching-item matching-item--request">
      <div className="matching-item__header">
        <span className="matching-item__title">{data.title}</span>
        <UrgencyBadge urgency={data.urgency} />
      </div>
      <div className="matching-item__details">
        <CategoryBadge title={data.categoryTitle ?? undefined} color={data.categoryColor ?? undefined} />
        {data.neighborhood && (
          <span className="matching-item__location">{data.neighborhood}</span>
        )}
      </div>
    </div>
  )
}
