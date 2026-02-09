interface AssetOverviewProps {
  config: {
    cloudName: string
    apiKey: string
    uploadPreset: string
  }
}

export function AssetOverview({config}: AssetOverviewProps) {
  const consoleUrl = `https://console.cloudinary.com/console/${config.cloudName}/media_library`

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 className="m-0 mb-4 text-base font-semibold text-gray-900">
          Cloud Details
        </h3>
        <dl className="m-0 flex flex-col gap-2.5">
          <div className="flex gap-4 items-baseline">
            <dt className="text-sm text-gray-500 min-w-[120px] shrink-0">
              Cloud Name
            </dt>
            <dd className="m-0 text-sm font-medium text-gray-700">
              {config.cloudName}
            </dd>
          </div>
          <div className="flex gap-4 items-baseline">
            <dt className="text-sm text-gray-500 min-w-[120px] shrink-0">
              API Key
            </dt>
            <dd className="m-0 text-sm font-medium text-gray-700">
              {config.apiKey}
            </dd>
          </div>
          <div className="flex gap-4 items-baseline">
            <dt className="text-sm text-gray-500 min-w-[120px] shrink-0">
              Upload Preset
            </dt>
            <dd className="m-0 text-sm font-medium text-gray-700">
              {config.uploadPreset || 'Not configured'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 className="m-0 mb-4 text-base font-semibold text-gray-900">
          Quick Links
        </h3>
        <div className="flex flex-col gap-2">
          <a
            href={consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-cl-blue no-underline text-sm font-medium transition-colors duration-150 hover:bg-gray-100 hover:border-gray-300"
          >
            <span className="text-base">&#x2197;</span>
            Open Cloudinary Console
          </a>
          <a
            href={`https://console.cloudinary.com/console/${config.cloudName}/settings/upload-presets`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-cl-blue no-underline text-sm font-medium transition-colors duration-150 hover:bg-gray-100 hover:border-gray-300"
          >
            <span className="text-base">&#x2699;</span>
            Upload Presets Settings
          </a>
          <a
            href={`https://console.cloudinary.com/console/${config.cloudName}/settings/api-keys`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-cl-blue no-underline text-sm font-medium transition-colors duration-150 hover:bg-gray-100 hover:border-gray-300"
          >
            <span className="text-base">&#x1F511;</span>
            API Keys Settings
          </a>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 className="m-0 mb-4 text-base font-semibold text-gray-900">
          Integration Info
        </h3>
        <p className="text-gray-500 text-sm/6 m-0 mb-4">
          The Browse tab fetches assets via a Next.js API proxy
          (<code className="bg-gray-100 px-1 rounded-xs text-xs">/api/cloudinary</code>)
          that calls the Cloudinary Admin &amp; Search APIs server-side. The Upload
          tab uses the Cloudinary Upload Widget. The Cloudinary asset source
          plugin in Sanity Studio adds a &quot;Cloudinary&quot; option to all
          image fields.
        </p>
        <div className="mt-4">
          <h4 className="m-0 mb-2 text-sm text-gray-700">
            Environment Variables
          </h4>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 bg-white border-b border-gray-200 text-gray-500 font-medium">
                  Variable
                </th>
                <th className="text-left px-3 py-2 bg-white border-b border-gray-200 text-gray-500 font-medium">
                  Context
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-xs">
                    SANITY_APP_CLOUDINARY_CLOUD_NAME
                  </code>
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  Dashboard App
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-xs">
                    SANITY_APP_CLOUDINARY_API_KEY
                  </code>
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  Dashboard App
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-xs">
                    SANITY_APP_CLOUDINARY_UPLOAD_PRESET
                  </code>
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  Dashboard App (Upload)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-xs">
                    SANITY_APP_API_URL
                  </code>
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  Dashboard App (Browse)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-xs">
                    CLOUDINARY_CLOUD_NAME
                  </code>
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  Next.js API (server)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-xs">
                    CLOUDINARY_API_KEY
                  </code>
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  Next.js API (server)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-xs">
                    CLOUDINARY_API_SECRET
                  </code>
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  Next.js API (server)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-xs">
                    SANITY_STUDIO_CLOUDINARY_CLOUD_NAME
                  </code>
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  Sanity Studio
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded-xs text-xs">
                    SANITY_STUDIO_CLOUDINARY_API_KEY
                  </code>
                </td>
                <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                  Sanity Studio
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
