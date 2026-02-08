import {useDocumentProjection, type DocumentHandle} from '@sanity/sdk-react'
import {UrgencyBadge} from './UrgencyBadge'
import {CategoryBadge} from './CategoryBadge'
import {StatusDropdown} from './StatusDropdown'
import './UrgentRequestRow.css'

const REQUEST_STATUS_OPTIONS = [
  {title: 'Open', value: 'open'},
  {title: 'In Progress', value: 'inProgress'},
  {title: 'Fulfilled', value: 'fulfilled'},
  {title: 'Closed', value: 'closed'},
]

const PROJECTION = `{
  title,
  urgency,
  status,
  neighborhood,
  dateNeeded,
  "categoryTitle": category->title,
  "categoryColor": category->color
}`

interface RequestProjection {
  title: string
  urgency: string
  status: string
  neighborhood: string | null
  dateNeeded: string | null
  categoryTitle: string | null
  categoryColor: string | null
}

export function UrgentRequestRow(handle: DocumentHandle) {
  const {data} = useDocumentProjection<RequestProjection>({
    ...handle,
    projection: PROJECTION,
  })

  if (!data) return null

  const formattedDate = data.dateNeeded
    ? new Date(data.dateNeeded).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
    : null

  return (
    <div className="urgent-row">
      <div className="urgent-row__main">
        <UrgencyBadge urgency={data.urgency} />
        <span className="urgent-row__title">{data.title}</span>
        <CategoryBadge title={data.categoryTitle ?? undefined} color={data.categoryColor ?? undefined} />
      </div>
      <div className="urgent-row__meta">
        {data.neighborhood && (
          <span className="urgent-row__location">{data.neighborhood}</span>
        )}
        {formattedDate && (
          <span className="urgent-row__date">Needed by {formattedDate}</span>
        )}
        <StatusDropdown {...handle} options={REQUEST_STATUS_OPTIONS} />
      </div>
    </div>
  )
}
