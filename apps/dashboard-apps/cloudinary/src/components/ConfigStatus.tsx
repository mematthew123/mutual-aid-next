interface ConfigStatusProps {
  config: {
    isConfigured: boolean
    cloudName: string
  }
}

export function ConfigStatus({config}: ConfigStatusProps) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        config.isConfigured
          ? 'bg-green-50 text-cl-green'
          : 'bg-red-50 text-cl-red'
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      <span className="whitespace-nowrap">
        {config.isConfigured ? config.cloudName : 'Not configured'}
      </span>
    </div>
  )
}
