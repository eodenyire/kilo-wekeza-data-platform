import { ToolLayout } from "@/components/ui/ToolNav";

export default function ToolLoading() {
  return (
    <ToolLayout currentTool="/dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading...</p>
        </div>
      </div>
    </ToolLayout>
  );
}
