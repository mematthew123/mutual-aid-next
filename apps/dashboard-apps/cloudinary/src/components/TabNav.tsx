import type {Tab} from '../CloudinaryDashboard'

interface TabNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: {id: Tab; label: string}[] = [
  {id: 'browse', label: 'Browse'},
  {id: 'upload', label: 'Upload'},
  {id: 'overview', label: 'Overview'},
]

export function TabNav({activeTab, onTabChange}: TabNavProps) {
  return (
    <nav className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-5 py-3 border-b-2 text-sm/5 font-medium -mb-px cursor-pointer bg-transparent transition-colors duration-150 ${
            activeTab === tab.id
              ? 'border-cl-blue text-cl-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
