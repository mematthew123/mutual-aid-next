import './CategoryBadge.css'

interface CategoryBadgeProps {
  title: string | undefined
  color: string | undefined
}

const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  gray: '#6b7280',
}

export function CategoryBadge({title, color}: CategoryBadgeProps) {
  if (!title) return null

  const dotColor = COLOR_MAP[color ?? 'gray'] ?? COLOR_MAP.gray

  return (
    <span className="category-badge">
      <span className="category-badge__dot" style={{backgroundColor: dotColor}} />
      {title}
    </span>
  )
}
