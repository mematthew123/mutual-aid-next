import {Suspense} from 'react'
import {useDocuments} from '@sanity/sdk-react'
import {MatchingOfferItem} from './MatchingOfferItem'

export function MatchingOffers() {
  const {data: handles, hasMore, loadMore, isPending} = useDocuments({
    documentType: 'resourceOffer',
    filter: 'status == "active"',
    orderings: [{field: '_createdAt', direction: 'desc'}],
    batchSize: 10,
  })

  return (
    <div className="matching-column">
      <h3 className="matching-column__title">
        Active Offers
        {handles.length > 0 && (
          <span className="panel-count">{handles.length}</span>
        )}
      </h3>
      {handles.length === 0 ? (
        <div className="panel-empty">No active offers</div>
      ) : (
        <div className="matching-column__list">
          {handles.map((handle) => (
            <Suspense
              key={handle.documentId}
              fallback={<div className="matching-item matching-item--loading">Loading...</div>}
            >
              <MatchingOfferItem {...handle} />
            </Suspense>
          ))}
          {hasMore && (
            <button
              className="matching-column__load-more"
              onClick={loadMore}
              disabled={isPending}
            >
              {isPending ? 'Loading...' : 'Load more'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
