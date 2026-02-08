const URGENCY_WEIGHT: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export function urgencyWeight(urgency: string | undefined): number {
  return URGENCY_WEIGHT[urgency ?? 'low'] ?? 3
}

export function urgencyLabel(urgency: string | undefined): string {
  const labels: Record<string, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }
  return labels[urgency ?? 'low'] ?? 'Low'
}
