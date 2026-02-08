import {Suspense} from 'react'
import {useDocument, useEditDocument, type DocumentHandle} from '@sanity/sdk-react'
import './StatusDropdown.css'

interface StatusOption {
  title: string
  value: string
}

interface StatusDropdownProps extends DocumentHandle {
  options: StatusOption[]
}

function StatusDropdownInner(props: StatusDropdownProps) {
  const {options, ...handle} = props
  const {data: currentStatus} = useDocument({...handle, path: 'status'})
  const editStatus = useEditDocument({...handle, path: 'status'})

  return (
    <select
      className="status-dropdown"
      value={(currentStatus as string) ?? ''}
      onChange={(e) => editStatus(e.currentTarget.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.title}
        </option>
      ))}
    </select>
  )
}

export function StatusDropdown(props: StatusDropdownProps) {
  return (
    <Suspense
      fallback={
        <select className="status-dropdown status-dropdown--loading" disabled>
          <option>...</option>
        </select>
      }
    >
      <StatusDropdownInner {...props} />
    </Suspense>
  )
}
