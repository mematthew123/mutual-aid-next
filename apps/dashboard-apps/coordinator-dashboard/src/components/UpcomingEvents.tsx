import {Suspense} from 'react'
import {useDocuments} from '@sanity/sdk-react'
import {EventRow} from './EventRow'
import './UpcomingEvents.css'

export function UpcomingEvents() {
  const {data: handles} = useDocuments({
    documentType: 'event',
    filter: 'status in ["draft", "published"] && startDateTime > now()',
    orderings: [{field: 'startDateTime', direction: 'asc'}],
    batchSize: 5,
  })

  return (
    <div className="panel upcoming-events">
      <div className="panel-header">
        <h2 className="panel-title">Upcoming Events</h2>
        {handles.length > 0 && (
          <span className="panel-count">{handles.length}</span>
        )}
      </div>
      {handles.length === 0 ? (
        <div className="panel-empty">No upcoming events</div>
      ) : (
        <div className="upcoming-events__list">
          {handles.map((handle) => (
            <Suspense
              key={handle.documentId}
              fallback={<div className="event-row event-row--loading">Loading...</div>}
            >
              <EventRow {...handle} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  )
}
