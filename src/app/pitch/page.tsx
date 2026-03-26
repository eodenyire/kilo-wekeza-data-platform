"use client";

import { useState, useEffect, useCallback } from "react";

const TOTAL_SLIDES = 14;

const GRADIENTS = [
  "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950", // 1: Vision
  "bg-gradient-to-br from-red-950 via-slate-950 to-red-950", // 2: Problem
  "bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-950", // 3: Solution
  "bg-gradient-to-br from-indigo-950 via-slate-950 to-indigo-950", // 4: Product
  "bg-gradient-to-br from-violet-950 via-slate-950 to-violet-950", // 5: Market
  "bg-gradient-to-br from-cyan-950 via-slate-950 to-cyan-950", // 6: Competitive
  "bg-gradient-to-br from-amber-950 via-slate-950 to-amber-950", // 7: Business Model
  "bg-gradient-to-br from-teal-950 via-slate-950 to-teal-950", // 8: Go-to-Market
  "bg-gradient-to-br from-fuchsia-950 via-slate-950 to-fuchsia-950", // 9: Tech
  "bg-gradient-to-br from-lime-950 via-slate-950 to-lime-950", // 10: Traction
  "bg-gradient-to-br from-sky-950 via-slate-950 to-sky-950", // 11: Roadmap
  "bg-gradient-to-br from-rose-950 via-slate-950 to-rose-950", // 12: Funding
  "bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950", // 13: Team
  "bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-950", // 14: Closing
];

function SlideNumberIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-mono">
      <span className="text-white/60">Slide </span>
      <span className="text-white font-bold">{current}</span>
      <span className="text-white/40"> / {total}</span>
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  );
}

function NavigationDots({
  current,
  total,
  onNavigate,
}: {
  current: number;
  total: number;
  onNavigate: (n: number) => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-3">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i + 1)}
          className={`rounded-full transition-all duration-300 ${
            i + 1 === current
              ? "bg-white w-6 h-2"
              : "bg-white/30 hover:bg-white/60 w-2 h-2"
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

function NavButtons({
  current,
  total,
  onPrev,
  onNext,
}: {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={current === 1}
        className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm transition-all"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={onNext}
        disabled={current === total}
        className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm transition-all"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

// --- Slide Components ---

function Slide1() {
  return (
    <div className="text-center space-y-8 animate-fadeIn">
      <div className="inline-block px-6 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium tracking-wider uppercase">
        Investor Presentation
      </div>
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent leading-tight">
        Wekeza
      </h1>
      <h2 className="text-3xl md:text-5xl font-light text-white/90">
        Data Platform
      </h2>
      <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed">
        From Data Silos to Global Intelligence
      </p>
      <div className="flex items-center justify-center gap-6 pt-8">
        <div className="h-px w-16 bg-white/20" />
        <p className="text-lg text-white/40 font-mono">
          &quot;One Platform. All Data. Global Decisions.&quot;
        </p>
        <div className="h-px w-16 bg-white/20" />
      </div>
      <div className="pt-12 flex flex-wrap justify-center gap-4">
        {[
          "Ingestion",
          "Observability",
          "Analytics",
          "ML Monitoring",
          "AI Decisions",
        ].map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function Slide2() {
  const problems = [
    {
      stat: "60%",
      label: "of enterprise data goes unused due to fragmentation",
      icon: "📊",
    },
    {
      stat: "70%",
      label: "of ML models drift without monitoring",
      icon: "🤖",
    },
    {
      stat: "30%",
      label: "of executive time spent manually aggregating reports",
      icon: "⏱️",
    },
  ];
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-red-400 text-sm font-mono uppercase tracking-widest">
          The Problem
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Enterprises Are Drowning in{" "}
          <span className="text-red-400">Data Chaos</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {problems.map((p) => (
          <div
            key={p.stat}
            className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center space-y-4 hover:bg-white/10 transition-all"
          >
            <div className="text-4xl">{p.icon}</div>
            <div className="text-5xl font-bold text-red-400">{p.stat}</div>
            <p className="text-white/60">{p.label}</p>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Fragmented data across databases",
            "ML models degrade silently",
            "No real-time decision support",
            "Manual pipelines are costly",
          ].map((item) => (
            <div
              key={item}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center"
            >
              <span className="text-red-400 text-2xl">✕</span>
              <p className="text-white/70 text-sm mt-2">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-emerald-400 text-sm font-mono uppercase tracking-widest">
          The Solution
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Wekeza Data Platform
        </h2>
        <p className="text-xl text-white/60 max-w-3xl mx-auto">
          A unified, intelligent data ecosystem that connects every source,
          monitors every model, and drives every decision.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          {
            title: "Connect Everything",
            desc: "All data sources globally—relational, NoSQL, streaming, APIs",
            icon: "🔗",
          },
          {
            title: "Automate & Optimize",
            desc: "AI-powered pipeline optimization and orchestration",
            icon: "⚙️",
          },
          {
            title: "Ensure Trust",
            desc: "Data quality scoring, lineage, and SLA enforcement",
            icon: "✅",
          },
          {
            title: "Monitor ML Models",
            desc: "Real-time drift detection and model performance tracking",
            icon: "🤖",
          },
          {
            title: "Deliver Intelligence",
            desc: "AI-driven executive recommendations and simulations",
            icon: "🧠",
          },
          {
            title: "Query Naturally",
            desc: "Federated queries and natural language analytics",
            icon: "💬",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-emerald-500/5 rounded-2xl border border-emerald-500/15 p-6 space-y-3 hover:bg-emerald-500/10 transition-all"
          >
            <div className="text-3xl">{item.icon}</div>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-white/50 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide4() {
  const layers = [
    {
      name: "Executive Intelligence",
      tools: "EAIDE",
      color: "from-purple-500 to-pink-500",
      desc: "AI-driven recommendations & scenario simulation",
    },
    {
      name: "ML Reliability",
      tools: "DDMMP",
      color: "from-rose-500 to-orange-500",
      desc: "Model drift monitoring & performance tracking",
    },
    {
      name: "Unified Analytics",
      tools: "NLQ · InsightAI · FALE",
      color: "from-cyan-500 to-blue-500",
      desc: "Predictive analytics, federated queries, natural language",
    },
    {
      name: "Observability & Governance",
      tools: "Data Vision · TrustScore · ContractGuard",
      color: "from-emerald-500 to-teal-500",
      desc: "Lineage tracking, data quality, SLA enforcement",
    },
    {
      name: "Data Ingestion & Pipelines",
      tools: "FlowCore · ADPO",
      color: "from-blue-500 to-indigo-500",
      desc: "ETL/ELT orchestration, auto-optimization",
    },
  ];
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
          Product Architecture
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          10 Integrated Tools
        </h2>
        <p className="text-xl text-white/60">
          Five layers of intelligence, from ingestion to decisions
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-3">
        {layers.map((layer, i) => (
          <div
            key={layer.name}
            className={`relative bg-gradient-to-r ${layer.color} rounded-xl p-6 flex items-center gap-6 hover:scale-[1.02] transition-transform`}
            style={{ opacity: 1 - i * 0.08 }}
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
              {i + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{layer.name}</h3>
              <p className="text-white/70 text-sm">{layer.desc}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-white/60 bg-black/30 px-3 py-1 rounded-full">
                {layer.tools}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide5() {
  const markets = [
    {
      name: "Enterprise Data Platforms",
      tam: "$100B+",
      description: "Global market for unified data management",
    },
    {
      name: "ML Monitoring & Observability",
      tam: "$10B+",
      description: "Growing demand for model reliability",
    },
    {
      name: "BI & Decision Intelligence",
      tam: "$30B+",
      description: "AI-driven business intelligence",
    },
  ];
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-violet-400 text-sm font-mono uppercase tracking-widest">
          Market Opportunity
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          $140B+ Total Addressable Market
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {markets.map((m) => (
          <div
            key={m.name}
            className="bg-white/5 rounded-2xl border border-violet-500/20 p-8 space-y-4 text-center hover:bg-white/10 transition-all"
          >
            <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              {m.tam}
            </div>
            <h3 className="text-xl font-semibold text-white">{m.name}</h3>
            <p className="text-white/50">{m.description}</p>
          </div>
        ))}
      </div>
      <div className="max-w-3xl mx-auto bg-violet-500/10 rounded-2xl border border-violet-500/20 p-6 text-center">
        <p className="text-white/70 text-lg">
          Target: Global enterprises with multi-cloud, multi-database operations
          needing trusted, AI-driven decisions.
        </p>
      </div>
    </div>
  );
}

function Slide6() {
  const competitors = [
    {
      name: "Tableau / ThoughtSpot / Qlik",
      category: "BI Only",
      limitation: "No pipeline, no ML, no governance",
    },
    {
      name: "WhyLabs / Fiddler AI",
      category: "ML Monitoring Only",
      limitation: "No data ingestion or analytics",
    },
    {
      name: "Informatica / Talend",
      category: "Data Integration Only",
      limitation: "No ML or executive intelligence",
    },
    {
      name: "Monte Carlo / Collibra",
      category: "Data Observability Only",
      limitation: "No optimization or AI decisions",
    },
  ];
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-cyan-400 text-sm font-mono uppercase tracking-widest">
          Competitive Landscape
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Fragmented Market,{" "}
          <span className="text-cyan-400">Unified Solution</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {competitors.map((c) => (
          <div
            key={c.name}
            className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{c.name}</h3>
              <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300">
                {c.category}
              </span>
            </div>
            <p className="text-white/50 text-sm">{c.limitation}</p>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto bg-cyan-500/10 rounded-2xl border border-cyan-500/20 p-8">
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          Wekeza Differentiation
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "End-to-end: pipelines to decisions",
            "AI-powered decision engine",
            "Real-time cross-database federation",
            "Enterprise-grade governance",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="text-cyan-400 text-xl">✓</span>
              <span className="text-white/80">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide7() {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-amber-400 text-sm font-mono uppercase tracking-widest">
          Business Model
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Three Revenue Streams
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          {
            title: "SaaS Subscription",
            desc: "Tiered pricing based on data volume and enterprise size",
            icon: "💰",
            growth: "Primary Revenue",
          },
          {
            title: "Premium AI Insights",
            desc: "Executive AI recommendations and scenario simulations",
            icon: "🧠",
            growth: "High Margin",
          },
          {
            title: "Consulting & Integration",
            desc: "Custom setup, training, and optimization services",
            icon: "🔧",
            growth: "Strategic",
          },
        ].map((stream) => (
          <div
            key={stream.title}
            className="bg-white/5 rounded-2xl border border-amber-500/20 p-8 space-y-4 text-center hover:bg-white/10 transition-all"
          >
            <div className="text-5xl">{stream.icon}</div>
            <h3 className="text-xl font-semibold text-white">{stream.title}</h3>
            <p className="text-white/50">{stream.desc}</p>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium">
              {stream.growth}
            </span>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          Projected ARR
        </h3>
        <div className="flex items-end justify-center gap-8 h-48">
          {[
            { year: "Year 1", arr: "$5M", height: "20%" },
            { year: "Year 3", arr: "$25M", height: "50%" },
            { year: "Year 5", arr: "$100M+", height: "100%" },
          ].map((item) => (
            <div
              key={item.year}
              className="flex flex-col items-center gap-2 w-24"
            >
              <span className="text-amber-400 font-bold text-lg">
                {item.arr}
              </span>
              <div
                className="w-full rounded-t-xl bg-gradient-to-t from-amber-600 to-amber-400 transition-all"
                style={{ height: item.height }}
              />
              <span className="text-white/60 text-sm">{item.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide8() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Large Enterprises",
      desc: "Finance, telecom, retail with multi-database environments",
      icon: "🏦",
    },
    {
      phase: "Phase 2",
      title: "Cloud Partnerships",
      desc: "Embedded deployment with AWS, GCP, Azure",
      icon: "☁️",
    },
    {
      phase: "Phase 3",
      title: "Global Expansion",
      desc: "Industry-specific AI insights for risk, marketing, operations",
      icon: "🌍",
    },
  ];
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-teal-400 text-sm font-mono uppercase tracking-widest">
          Go-to-Market Strategy
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Phased Market Entry
        </h2>
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        {phases.map((p, i) => (
          <div
            key={p.phase}
            className="flex items-center gap-6 bg-white/5 rounded-2xl border border-teal-500/15 p-6 hover:bg-white/10 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center text-3xl shrink-0">
              {p.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-teal-400 font-mono text-sm">
                  {p.phase}
                </span>
                {i < phases.length - 1 && (
                  <div className="h-px flex-1 bg-teal-500/20" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-white">{p.title}</h3>
              <p className="text-white/50">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-4">
        {[
          "Enterprise sales teams",
          "Conference speaking",
          "Thought leadership content",
        ].map((ch) => (
          <div
            key={ch}
            className="bg-teal-500/10 rounded-xl p-4 text-center border border-teal-500/20"
          >
            <p className="text-teal-300 text-sm font-medium">{ch}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide9() {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-fuchsia-400 text-sm font-mono uppercase tracking-widest">
          Technical Differentiation
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Built for Scale & Speed
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          {
            title: "Real-Time Optimization",
            desc: "Pipeline auto-tuning with AI-driven recommendations",
            icon: "⚡",
          },
          {
            title: "Federated Queries",
            desc: "Cross-database SQL without data movement",
            icon: "🌐",
          },
          {
            title: "ML Drift Detection",
            desc: "Continuous model monitoring and alerting",
            icon: "📡",
          },
          {
            title: "Executive AI Engine",
            desc: "Scenario simulation and decision support",
            icon: "🧠",
          },
          {
            title: "Enterprise Security",
            desc: "RBAC, encryption, audit logs, compliance",
            icon: "🔒",
          },
          {
            title: "Petabyte Scale",
            desc: "Thousands of pipelines and models",
            icon: "📈",
          },
        ].map((tech) => (
          <div
            key={tech.title}
            className="bg-white/5 rounded-2xl border border-fuchsia-500/15 p-6 space-y-3 hover:bg-white/10 transition-all"
          >
            <div className="text-3xl">{tech.icon}</div>
            <h3 className="text-lg font-semibold text-white">{tech.title}</h3>
            <p className="text-white/50 text-sm">{tech.desc}</p>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
        {["Python", "FastAPI", "React", "Neo4J", "Kafka", "Postgres", "Kubernetes"].map(
          (tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-sm font-mono"
            >
              {tech}
            </span>
          )
        )}
      </div>
    </div>
  );
}

function Slide10() {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-lime-400 text-sm font-mono uppercase tracking-widest">
          Traction & Proof of Concept
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Validated Approach
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="bg-white/5 rounded-2xl border border-lime-500/15 p-8 space-y-6">
          <h3 className="text-xl font-semibold text-lime-400">
            PoC Highlights
          </h3>
          <ul className="space-y-4">
            {[
              "Integrated Postgres + MongoDB with pipeline monitoring",
              "Federated query engine executed cross-database queries",
              "ML drift detection triggered alerts on simulated changes",
              "Executive dashboard delivered AI-driven marketing recommendation",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-lime-400 mt-1">✓</span>
                <span className="text-white/70">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="bg-lime-500/10 rounded-2xl border border-lime-500/20 p-8 text-center">
            <div className="text-5xl font-bold text-lime-400">80%</div>
            <p className="text-white/60 mt-2">
              Reduction in manual reporting effort
            </p>
          </div>
          <div className="bg-lime-500/10 rounded-2xl border border-lime-500/20 p-8 text-center">
            <div className="text-5xl font-bold text-lime-400">90%</div>
            <p className="text-white/60 mt-2">Confidence in ML predictions</p>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
        <p className="text-white/60">
          Background in banking (Equity Group Holdings PLC) and telecom
          (Safaricom PLC) provides domain credibility in risk, fraud, and
          large-scale data operations.
        </p>
      </div>
    </div>
  );
}

function Slide11() {
  const milestones = [
    {
      phase: "Phase 1",
      time: "0–3 months",
      items: [
        "Core pipelines",
        "Observability",
        "PoC deployment",
      ],
      color: "border-blue-500",
    },
    {
      phase: "Phase 2",
      time: "3–6 months",
      items: [
        "Federated analytics",
        "Predictive AI",
        "Beta release",
      ],
      color: "border-cyan-500",
    },
    {
      phase: "Phase 3",
      time: "6–12 months",
      items: [
        "ML monitoring",
        "Executive AI engine",
        "GA release",
      ],
      color: "border-emerald-500",
    },
    {
      phase: "Phase 4",
      time: "12–24 months",
      items: [
        "Global deployment",
        "Full automation",
        "Marketplace",
      ],
      color: "border-purple-500",
    },
  ];
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-sky-400 text-sm font-mono uppercase tracking-widest">
          Roadmap
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          24-Month Execution Plan
        </h2>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div
              key={m.phase}
              className={`bg-white/5 rounded-2xl border-t-4 ${m.color} p-6 space-y-4`}
            >
              <div>
                <span className="text-sky-400 font-mono text-sm">
                  {m.phase}
                </span>
                <h3 className="text-white font-semibold">{m.time}</h3>
              </div>
              <ul className="space-y-2">
                {m.items.map((item) => (
                  <li
                    key={item}
                    className="text-white/60 text-sm flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide12() {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-rose-400 text-sm font-mono uppercase tracking-widest">
          The Ask
        </span>
        <h2 className="text-5xl md:text-7xl font-bold">
          <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
            $10M
          </span>
        </h2>
        <p className="text-xl text-white/60">
          Seed / Series A Funding Round
        </p>
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {[
          {
            category: "Platform Development",
            pct: "40%",
            amount: "$4M",
            color: "bg-blue-500",
          },
          {
            category: "Sales & Marketing",
            pct: "25%",
            amount: "$2.5M",
            color: "bg-emerald-500",
          },
          {
            category: "Cloud Infrastructure & Security",
            pct: "20%",
            amount: "$2M",
            color: "bg-violet-500",
          },
          {
            category: "Research & AI Innovation",
            pct: "15%",
            amount: "$1.5M",
            color: "bg-amber-500",
          },
        ].map((item) => (
          <div
            key={item.category}
            className="bg-white/5 rounded-2xl border border-white/10 p-6 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center font-bold text-white`}
            >
              {item.pct}
            </div>
            <div>
              <h3 className="text-white font-semibold">{item.category}</h3>
              <p className="text-white/50 text-sm">{item.amount}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-3xl mx-auto bg-rose-500/10 rounded-2xl border border-rose-500/20 p-6 text-center">
        <p className="text-white/70 text-lg font-medium">
          Goal: Enterprise-scale deployment within 12 months
        </p>
      </div>
    </div>
  );
}

function Slide13() {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <span className="text-purple-400 text-sm font-mono uppercase tracking-widest">
          The Team
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white">
          Built by Experts
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          {
            role: "Founder / CEO",
            bg: "Data & business strategy expert",
            experience: "Equity Group Holdings PLC, Safaricom PLC",
          },
          {
            role: "CTO",
            bg: "Global data architecture experience",
            experience: "Enterprise platform engineering",
          },
          {
            role: "VP Engineering",
            bg: "Built ML monitoring platforms",
            experience: "Distributed systems specialist",
          },
          {
            role: "AI Lead",
            bg: "Predictive analytics & decision intelligence",
            experience: "NLP and ML model optimization",
          },
          {
            role: "Head of Sales",
            bg: "Enterprise B2B sales",
            experience: "SaaS growth in emerging markets",
          },
          {
            role: "Advisors",
            bg: "Industry experts",
            experience: "Cloud, ML, enterprise data systems",
          },
        ].map((member) => (
          <div
            key={member.role}
            className="bg-white/5 rounded-2xl border border-purple-500/15 p-6 space-y-3 hover:bg-white/10 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">{member.role}</h3>
            <p className="text-white/50 text-sm">{member.bg}</p>
            <p className="text-purple-300/60 text-xs">{member.experience}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide14() {
  return (
    <div className="text-center space-y-12 animate-fadeIn">
      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
        Wekeza Data Platform
      </h1>
      <p className="text-2xl md:text-3xl text-white/80 max-w-4xl mx-auto leading-relaxed">
        From raw data to global decisions — empowering enterprises to act with
        confidence.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {[
          "One Platform",
          "All Data",
          "Global Decisions",
        ].map((tag) => (
          <span
            key={tag}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/80 text-lg font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="max-w-3xl mx-auto space-y-4 pt-8">
        <h2 className="text-xl font-semibold text-white">Next Steps</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { step: "1", text: "Schedule deep-dive session" },
            { step: "2", text: "Review technical architecture" },
            { step: "3", text: "Discuss partnership terms" },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white/5 rounded-xl border border-white/10 p-4 text-center"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center mx-auto mb-2">
                {s.step}
              </div>
              <p className="text-white/60 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-8 text-white/30 text-sm">
        Confidential — Wekeza Data Platform — Investor Presentation
      </div>
    </div>
  );
}

const SLIDES = [
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12,
  Slide13,
  Slide14,
];

export default function PitchPage() {
  const [current, setCurrent] = useState(1);

  const goNext = useCallback(() => {
    setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES));
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((c) => Math.max(c - 1, 1));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const CurrentSlide = SLIDES[current - 1];

  return (
    <div className={GRADIENTS[current - 1]}>
      <ProgressBar current={current} total={TOTAL_SLIDES} />
      <SlideNumberIndicator current={current} total={TOTAL_SLIDES} />

      <div className="min-h-screen flex items-center justify-center p-6 md:p-16 pb-20">
        <div className="w-full max-w-6xl">
          <CurrentSlide />
        </div>
      </div>

      <NavigationDots
        current={current}
        total={TOTAL_SLIDES}
        onNavigate={setCurrent}
      />
      <NavButtons
        current={current}
        total={TOTAL_SLIDES}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
