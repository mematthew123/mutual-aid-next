import {type SanityConfig} from '@sanity/sdk'
import {SanityApp} from '@sanity/sdk-react'
import {CloudinaryDashboard} from './CloudinaryDashboard'
import './App.css'

function App() {
  const sanityConfigs: SanityConfig[] = [
    {
      projectId: '51mpsx72',
      dataset: 'production',
    },
  ]

  return (
    <div className="mx-auto max-w-6xl p-6">
      <SanityApp config={sanityConfigs} fallback={<div>Loading...</div>}>
        <CloudinaryDashboard />
      </SanityApp>
    </div>
  )
}

export default App
