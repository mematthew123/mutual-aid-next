import {urgencyLabel} from '../helpers/urgencySort'
import './UrgencyBadge.css'

interface UrgencyBadgeProps {
  urgency: string | undefined
}

export function UrgencyBadge({urgency}: UrgencyBadgeProps) {
  const level = urgency ?? 'low'
  return (
    <span className={`urgency-badge urgency-badge--${level}`}>
      {urgencyLabel(urgency)}
    </span>
  )
}
