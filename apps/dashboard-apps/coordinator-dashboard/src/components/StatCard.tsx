import './StatCard.css'

interface StatCardProps {
  label: string
  value: number
  icon: string
  color?: string
}

export function StatCard({label, value, icon, color}: StatCardProps) {
  return (
    <div className="stat-card" style={color ? {'--stat-color': color} as React.CSSProperties : undefined}>
      <span className="stat-card__icon">{icon}</span>
      <div className="stat-card__content">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
      </div>
    </div>
  )
}
