"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-white min-h-dvh flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-6xl font-bold text-gray-200 mb-6">!</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-8">
            We apologize for the inconvenience. Please try again.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
