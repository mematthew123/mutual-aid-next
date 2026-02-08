import {useDocumentProjection, type DocumentHandle} from '@sanity/sdk-react'
import './EventRow.css'

const PROJECTION = `{
  title,
  eventType,
  startDateTime,
  endDateTime,
  volunteersNeeded,
  status
}`

interface EventProjection {
  title: string
  eventType: string
  startDateTime: string
  endDateTime: string | null
  volunteersNeeded: number | null
  status: string
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  distribution: 'Distribution',
  volunteer: 'Volunteer Day',
  meeting: 'Meeting',
  workshop: 'Workshop',
  fundraiser: 'Fundraiser',
  social: 'Social',
  other: 'Other',
}

const EVENT_TYPE_ICONS: Record<string, string> = {
  distribution: '📦',
  volunteer: '🙋',
  meeting: '💬',
  workshop: '🛠',
  fundraiser: '💰',
  social: '🎉',
  other: '📌',
}

export function EventRow(handle: DocumentHandle) {
  const {data} = useDocumentProjection<EventProjection>({
    ...handle,
    projection: PROJECTION,
  })

  if (!data) return null

  const date = new Date(data.startDateTime)
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="event-row">
      <span className="event-row__icon">
        {EVENT_TYPE_ICONS[data.eventType] ?? '📌'}
      </span>
      <div className="event-row__content">
        <span className="event-row__title">{data.title}</span>
        <div className="event-row__meta">
          <span className="event-row__date">{formattedDate} at {formattedTime}</span>
          <span className="event-row__type">
            {EVENT_TYPE_LABELS[data.eventType] ?? data.eventType}
          </span>
        </div>
      </div>
      {data.volunteersNeeded != null && data.volunteersNeeded > 0 && (
        <span className="event-row__volunteers">
          {data.volunteersNeeded} needed
        </span>
      )}
    </div>
  )
}
