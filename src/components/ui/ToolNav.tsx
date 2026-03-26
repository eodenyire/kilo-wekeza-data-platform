import Link from "next/link";
import { ReactNode } from "react";

interface ToolNavProps {
  currentTool: string;
}

const TOOLS = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/tool/lineage", label: "Lineage", icon: "🔗" },
  { href: "/tool/nlq", label: "NLQ Engine", icon: "💬" },
  { href: "/tool/pipeline", label: "Pipelines", icon: "⚙️" },
  { href: "/tool/fraud", label: "Fraud", icon: "🔍" },
  { href: "/tool/quality", label: "Quality", icon: "📊" },
  { href: "/tool/contracts", label: "Contracts", icon: "📋" },
  { href: "/tool/optimizer", label: "Optimizer", icon: "⚡" },
  { href: "/tool/federated", label: "Federated", icon: "🌐" },
  { href: "/tool/drift", label: "Drift Monitor", icon: "📡" },
  { href: "/tool/executive", label: "Executive AI", icon: "🧠" },
];

export function ToolNav({ currentTool }: ToolNavProps) {
  return (
    <nav className="fixed left-0 top-0 bottom-0 w-56 bg-black/60 backdrop-blur-sm border-r border-white/10 z-50 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-sm">
            W
          </div>
          <span className="text-white font-semibold">Wekeza</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all ${
              currentTool === tool.href
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <span className="text-base">{tool.icon}</span>
            <span>{tool.label}</span>
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-white/10">
        <p className="text-white/30 text-xs">Wekeza Data Platform v1.0</p>
      </div>
    </nav>
  );
}

interface ToolLayoutProps {
  children: ReactNode;
  currentTool: string;
}

export function ToolLayout({ children, currentTool }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-950">
      <ToolNav currentTool={currentTool} />
      <main className="ml-56 p-8">{children}</main>
    </div>
  );
}
