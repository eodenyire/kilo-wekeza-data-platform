import { ReactNode } from "react";

interface SlideLayoutProps {
  children: ReactNode;
  slideNumber: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  gradient: string;
}

export function SlideLayout({
  children,
  slideNumber,
  totalSlides,
  onNext,
  onPrev,
  gradient,
}: SlideLayoutProps) {
  return (
    <div
      className={`relative min-h-screen w-full ${gradient} text-white flex flex-col overflow-hidden`}
    >
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-6xl">{children}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-sm z-50">
        <button
          onClick={onPrev}
          disabled={slideNumber === 1}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i + 1 === slideNumber
                  ? "bg-white w-6"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">
            {slideNumber} / {totalSlides}
          </span>
          <button
            onClick={onNext}
            disabled={slideNumber === totalSlides}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
