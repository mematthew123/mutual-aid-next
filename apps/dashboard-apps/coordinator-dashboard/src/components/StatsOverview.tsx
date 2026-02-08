import {useQuery} from '@sanity/sdk-react'
import {StatCard} from './StatCard'
import './StatsOverview.css'

const STATS_QUERY = `{
  "openRequests": count(*[_type == "resourceRequest" && status in ["open", "inProgress"]]),
  "activeOffers": count(*[_type == "resourceOffer" && status == "active"]),
  "upcomingEvents": count(*[_type == "event" && status in ["draft", "published"] && startDateTime > now()]),
  "activeCampaigns": count(*[_type == "donationCampaign" && status == "active"])
}`

interface StatsData {
  openRequests: number
  activeOffers: number
  upcomingEvents: number
  activeCampaigns: number
}

export function StatsOverview() {
  const {data} = useQuery<StatsData>({query: STATS_QUERY})

  const stats = data ?? {openRequests: 0, activeOffers: 0, upcomingEvents: 0, activeCampaigns: 0}

  return (
    <div className="stats-overview">
      <StatCard
        label="Open Requests"
        value={stats.openRequests}
        icon="🆘"
        color="var(--color-high)"
      />
      <StatCard
        label="Active Offers"
        value={stats.activeOffers}
        icon="🤝"
        color="var(--color-success)"
      />
      <StatCard
        label="Upcoming Events"
        value={stats.upcomingEvents}
        icon="📅"
        color="var(--color-info)"
      />
      <StatCard
        label="Active Campaigns"
        value={stats.activeCampaigns}
        icon="💚"
        color="var(--color-primary)"
      />
    </div>
  )
}
