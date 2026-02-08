import {Suspense} from 'react'
import {useDocuments} from '@sanity/sdk-react'
import {UrgentRequestRow} from './UrgentRequestRow'
import './UrgentRequests.css'

export function UrgentRequests() {
  const {data: handles} = useDocuments({
    documentType: 'resourceRequest',
    filter: 'status in ["open", "inProgress"] && urgency in ["critical", "high"]',
    orderings: [{field: '_createdAt', direction: 'desc'}],
    batchSize: 10,
  })

  return (
    <div className="panel urgent-requests">
      <div className="panel-header">
        <h2 className="panel-title">Urgent Requests</h2>
        {handles.length > 0 && (
          <span className="panel-count">{handles.length}</span>
        )}
      </div>
      {handles.length === 0 ? (
        <div className="panel-empty">No urgent requests right now</div>
      ) : (
        <div className="urgent-requests__list">
          {handles.map((handle) => (
            <Suspense
              key={handle.documentId}
              fallback={<div className="urgent-row urgent-row--loading">Loading...</div>}
            >
              <UrgentRequestRow {...handle} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  )
}
