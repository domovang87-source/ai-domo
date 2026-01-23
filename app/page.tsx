export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-12">
        <div className="w-full space-y-8 text-center">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                AI Domo
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-2xl font-medium leading-relaxed text-gray-700 sm:text-3xl">
              Drop the situation. I'll tell you the move and the exact text to send.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href="/pricing"
              className="btn-premium group inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/40 active:scale-[0.98]"
            >
              <span>Get Started</span>
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>

          {/* Simple Footer Note */}
          <p className="pt-8 text-sm text-gray-500">
            No signup • No BS • Just results
          </p>
        </div>
      </main>
    </div>
  );
}
