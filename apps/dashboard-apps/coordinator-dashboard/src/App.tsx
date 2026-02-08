import {type SanityConfig} from '@sanity/sdk'
import {SanityApp} from '@sanity/sdk-react'
import {Dashboard} from './Dashboard'
import './App.css'

function App() {
  const sanityConfigs: SanityConfig[] = [
    {
      projectId: '51mpsx72',
      dataset: 'production',
    },
  ]

  return (
    <SanityApp config={sanityConfigs} fallback={<div className="app-loading">Loading...</div>}>
      <Dashboard />
    </SanityApp>
  )
}

export default App
