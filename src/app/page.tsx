import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          Wekeza Data Platform
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          From Data Silos to Global Intelligence
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/pitch"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:from-blue-500 hover:to-cyan-400 transition-all"
          >
            View Investor Pitch Deck
          </Link>
        </div>
      </div>
    </main>
  );
}
