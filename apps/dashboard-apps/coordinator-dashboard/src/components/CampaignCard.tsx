import {useDocumentProjection, type DocumentHandle} from '@sanity/sdk-react'
import './CampaignCard.css'

const PROJECTION = `{
  title,
  campaignType,
  "goalAmount": goal.amount,
  "currentAmount": goal.currentAmount,
  "hasGoal": goal.hasGoal,
  "showProgress": goal.showProgress,
  status
}`

interface CampaignProjection {
  title: string
  campaignType: string | null
  goalAmount: number | null
  currentAmount: number | null
  hasGoal: boolean | null
  showProgress: boolean | null
  status: string
}

const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  general: 'General Fund',
  emergency: 'Emergency',
  specific: 'Specific Cause',
  recurring: 'Recurring',
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function CampaignCard(handle: DocumentHandle) {
  const {data} = useDocumentProjection<CampaignProjection>({
    ...handle,
    projection: PROJECTION,
  })

  if (!data) return null

  const current = data.currentAmount ?? 0
  const goal = data.goalAmount ?? 0
  const hasGoal = data.hasGoal && goal > 0
  const percentage = hasGoal ? Math.min(Math.round((current / goal) * 100), 100) : 0

  return (
    <div className="campaign-card">
      <div className="campaign-card__header">
        <span className="campaign-card__title">{data.title}</span>
        {data.campaignType && (
          <span className="campaign-card__type">
            {CAMPAIGN_TYPE_LABELS[data.campaignType] ?? data.campaignType}
          </span>
        )}
      </div>
      <div className="campaign-card__amounts">
        <span className="campaign-card__current">{formatCurrency(current)}</span>
        {hasGoal && (
          <span className="campaign-card__goal"> of {formatCurrency(goal)}</span>
        )}
      </div>
      {hasGoal && data.showProgress !== false && (
        <div className="campaign-card__progress">
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{width: `${percentage}%`}}
            />
          </div>
          <span className="campaign-card__percentage">{percentage}%</span>
        </div>
      )}
    </div>
  )
}
