"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";

interface ToolNavProps {
  currentTool: string;
}

const TOOLS = [
  { href: "/dashboard", label: "Dashboard", icon: "\u{1F3E0}" },
  { href: "/tool/lineage", label: "Lineage", icon: "\u{1F517}" },
  { href: "/tool/nlq", label: "NLQ Engine", icon: "\u{1F4AC}" },
  { href: "/tool/pipeline", label: "Pipelines", icon: "\u2699\uFE0F" },
  { href: "/tool/fraud", label: "Fraud", icon: "\u{1F50D}" },
  { href: "/tool/quality", label: "Quality", icon: "\u{1F4CA}" },
  { href: "/tool/contracts", label: "Contracts", icon: "\u{1F4CB}" },
  { href: "/tool/optimizer", label: "Optimizer", icon: "\u26A1" },
  { href: "/tool/federated", label: "Federated", icon: "\u{1F310}" },
  { href: "/tool/drift", label: "Drift Monitor", icon: "\u{1F4E1}" },
  { href: "/tool/executive", label: "Executive AI", icon: "\u{1F9E0}" },
];

export function ToolNav({ currentTool }: ToolNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] lg:hidden p-2 rounded-lg bg-black/80 border border-white/10 text-white"
        aria-label="Toggle navigation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={`fixed left-0 top-0 bottom-0 w-56 bg-black/60 backdrop-blur-sm border-r border-white/10 z-50 flex flex-col transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
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
              onClick={() => setIsOpen(false)}
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
    </>
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
      <main className="lg:ml-56 p-8 pt-16 lg:pt-8">{children}</main>
    </div>
  );
}
