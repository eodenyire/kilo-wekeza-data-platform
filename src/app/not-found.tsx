import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-white/20">404</h1>
        <h2 className="text-2xl font-bold text-white">Page not found</h2>
        <p className="text-white/50">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
