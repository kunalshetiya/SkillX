export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to <span className="text-blue-600">SkillX</span>
        </h1>
      </div>
      <p className="mt-6 text-lg leading-8 text-gray-600 text-center">
        The future of skill bartering and mentorship.
      </p>
    </main>
  );
}
