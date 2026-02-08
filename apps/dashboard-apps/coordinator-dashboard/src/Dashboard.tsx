import {Suspense} from 'react'
import {useCurrentUser, type CurrentUser} from '@sanity/sdk-react'
import {StatsOverview} from './components/StatsOverview'
import {UrgentRequests} from './components/UrgentRequests'
import {MatchingPanel} from './components/MatchingPanel'
import {UpcomingEvents} from './components/UpcomingEvents'
import {CampaignProgress} from './components/CampaignProgress'
import './Dashboard.css'

function DashboardHeader() {
  const user: CurrentUser | null = useCurrentUser()

  return (
    <header className="dashboard-header">
      <div>
        <h1 className="dashboard-title">Coordinator Dashboard</h1>
        <p className="dashboard-subtitle">
          {user?.name ? `Welcome back, ${user.name}` : 'Mutual Aid Network'}
        </p>
      </div>
    </header>
  )
}

export function Dashboard() {
  return (
    <div className="dashboard">
      <Suspense fallback={<header className="dashboard-header"><h1 className="dashboard-title">Coordinator Dashboard</h1></header>}>
        <DashboardHeader />
      </Suspense>

      <div className="dashboard-grid">
        <section className="dashboard-stats">
          <Suspense fallback={<div className="panel panel--loading">Loading stats...</div>}>
            <StatsOverview />
          </Suspense>
        </section>

        <section className="dashboard-urgent">
          <Suspense fallback={<div className="panel panel--loading">Loading urgent requests...</div>}>
            <UrgentRequests />
          </Suspense>
        </section>

        <section className="dashboard-matching">
          <MatchingPanel />
        </section>

        <section className="dashboard-events">
          <Suspense fallback={<div className="panel panel--loading">Loading events...</div>}>
            <UpcomingEvents />
          </Suspense>
        </section>

        <section className="dashboard-campaigns">
          <Suspense fallback={<div className="panel panel--loading">Loading campaigns...</div>}>
            <CampaignProgress />
          </Suspense>
        </section>
      </div>
    </div>
  )
}
