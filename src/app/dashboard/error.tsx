"use client";

import { ToolLayout } from "@/components/ui/ToolNav";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ToolLayout currentTool="/dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-xl text-red-400">!</span>
          </div>
          <h2 className="text-xl font-bold text-white">Failed to load dashboard</h2>
          <p className="text-white/50 text-sm">
            {error.message || "Could not fetch dashboard data."}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
