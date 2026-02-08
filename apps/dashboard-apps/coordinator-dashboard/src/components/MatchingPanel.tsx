import {Suspense} from 'react'
import {MatchingRequests} from './MatchingRequests'
import {MatchingOffers} from './MatchingOffers'
import './MatchingPanel.css'
import './MatchingItem.css'

export function MatchingPanel() {
  return (
    <div className="panel matching-panel">
      <div className="panel-header">
        <h2 className="panel-title">Request &amp; Offer Matching</h2>
      </div>
      <div className="matching-panel__grid">
        <Suspense fallback={<div className="matching-column"><div className="panel--loading">Loading requests...</div></div>}>
          <MatchingRequests />
        </Suspense>
        <Suspense fallback={<div className="matching-column"><div className="panel--loading">Loading offers...</div></div>}>
          <MatchingOffers />
        </Suspense>
      </div>
    </div>
  )
}
