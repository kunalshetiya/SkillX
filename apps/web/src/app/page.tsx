import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to <span className="text-blue-600">SkillX</span>
        </h1>
      </div>
      <p className="mt-6 text-lg leading-8 text-gray-600 text-center max-w-2xl">
        The future of skill bartering and mentorship. Exchange what you know for what you want to learn.
      </p>
      
      <div className="mt-10 flex gap-4">
        <Link 
          href="/profile" 
          className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Go to Dashboard
        </Link>
        <button className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Browse Skills
        </button>
      </div>
    </main>
  );
}
