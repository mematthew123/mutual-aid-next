import {useState} from 'react'
import {useCurrentUser, type CurrentUser} from '@sanity/sdk-react'
import {useCloudinaryConfig} from './hooks/useCloudinaryConfig'
import {ConfigStatus} from './components/ConfigStatus'
import {TabNav} from './components/TabNav'
import {MediaLibraryBrowser} from './components/MediaLibraryBrowser'
import {UploadPanel} from './components/UploadPanel'
import {AssetOverview} from './components/AssetOverview'

export type Tab = 'browse' | 'upload' | 'overview'

export function CloudinaryDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('browse')
  const user: CurrentUser | null = useCurrentUser()
  const config = useCloudinaryConfig()

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-xl bg-white pt-5 px-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#3448c5">
              <path d="M19.31 8.91A6.44 6.44 0 0 0 6.85 7.57a4.88 4.88 0 0 0-2.57 9.15.5.5 0 0 0 .35-.94 3.88 3.88 0 0 1 2.06-7.28l.4.04.13-.38a5.44 5.44 0 0 1 10.52 1.15l.09.56.52.2a3.38 3.38 0 0 1-.99 6.62h-.8a.5.5 0 0 0 0 1h.8a4.38 4.38 0 0 0 1.95-8.28zM14.35 14.7a.5.5 0 0 0 .71-.71l-2.82-2.83a.51.51 0 0 0-.36-.15.5.5 0 0 0-.36.15L8.7 13.99a.5.5 0 0 0 .71.71l1.97-1.97v5.78a.5.5 0 0 0 1 0v-5.78z" />
            </svg>
            <h1 className="m-0 text-xl/7 font-semibold text-gray-900">
              Cloudinary Media
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user?.name && (
              <span className="text-sm text-gray-500">{user.name}</span>
            )}
            <ConfigStatus config={config} />
          </div>
        </div>
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </header>

      <main className="rounded-xl bg-white shadow-xs min-h-[500px]">
        {!config.isConfigured ? (
          <div className="px-8 py-12 text-center">
            <h2 className="m-0 mb-3 text-xl text-gray-700">
              Configuration Required
            </h2>
            <p className="text-gray-500 m-0 mb-4">
              Set the following environment variables in your{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded-xs text-sm text-cl-red">
                .env.local
              </code>{' '}
              file:
            </p>
            <ul className="list-none p-0 flex flex-col gap-2 items-center">
              {config.missingVars.map((v) => (
                <li key={v}>
                  <code className="bg-gray-100 px-2 py-0.5 rounded-xs text-sm text-cl-red">
                    {v}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {activeTab === 'browse' && <MediaLibraryBrowser config={config} />}
            {activeTab === 'upload' && <UploadPanel config={config} />}
            {activeTab === 'overview' && <AssetOverview config={config} />}
          </>
        )}
      </main>
    </div>
  )
}
