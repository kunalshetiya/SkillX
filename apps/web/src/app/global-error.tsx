'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
          <h2 className="text-2xl font-bold text-red-600">A critical error occurred!</h2>
          <p className="mt-4 text-gray-600 max-w-md">
            {error.message || "A fatal error happened in the root layout."}
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-50"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
