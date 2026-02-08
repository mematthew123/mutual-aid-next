import {Suspense} from 'react'
import {useDocuments} from '@sanity/sdk-react'
import {CampaignCard} from './CampaignCard'
import './CampaignProgress.css'

export function CampaignProgress() {
  const {data: handles} = useDocuments({
    documentType: 'donationCampaign',
    filter: 'status == "active"',
    orderings: [{field: '_createdAt', direction: 'desc'}],
    batchSize: 5,
  })

  return (
    <div className="panel campaign-progress">
      <div className="panel-header">
        <h2 className="panel-title">Campaign Progress</h2>
        {handles.length > 0 && (
          <span className="panel-count">{handles.length}</span>
        )}
      </div>
      {handles.length === 0 ? (
        <div className="panel-empty">No active campaigns</div>
      ) : (
        <div className="campaign-progress__list">
          {handles.map((handle) => (
            <Suspense
              key={handle.documentId}
              fallback={<div className="campaign-card campaign-card--loading">Loading...</div>}
            >
              <CampaignCard {...handle} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  )
}
