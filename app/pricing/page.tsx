import Image from "next/image";

export default function PricingPage() {

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg overflow-hidden border-2 border-red-200">
              <Image src="/icon.jpg" alt="AI Domo" width={64} height={64} className="object-cover" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                AI Domo
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Get unlimited access to your dating coach
            </p>
          </div>

          {/* Pricing Card */}
          <div className="rounded-2xl border-2 border-red-200 bg-white p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Weekly Subscription</h2>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-red-600">$9.99</span>
                  <span className="text-gray-600">/week</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Cancel anytime from your account
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-left">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Unlimited coaching sessions</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Exact texts to send</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Tactical dating advice</span>
                </div>
              </div>

              <a
                href="/signup"
                className="btn-premium block w-full rounded-2xl px-8 py-4 text-center text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/40 active:scale-[0.98]"
              >
                Get Started
              </a>
            </div>
          </div>

          <a
            href="/"
            className="inline-block text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to home
          </a>
        </div>
      </main>
    </div>
  );
}
