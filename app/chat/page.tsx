"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Msg = { role: "user" | "assistant"; content: string };

function formatMessage(content: string) {
  // Split by lines and format
  const lines = content.split('\n').filter(line => line.trim() || line === '');
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        
        // Check if it's quoted text (exact text to send)
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          return (
            <div key={i} className="my-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 font-mono text-sm text-red-700">
              {trimmed.replace(/"/g, '')}
            </div>
          );
        }
        
        // Check if it's a heading (starts with number)
        if (/^\d+\)/.test(trimmed)) {
          return <div key={i} className="font-semibold text-gray-900 mt-3 first:mt-0">{line}</div>;
        }
        
        // Check if it's a bullet point
        if (trimmed.startsWith('-')) {
          return <div key={i} className="ml-4 text-gray-700">{line}</div>;
        }
        
        // Regular line
        return <div key={i} className="text-gray-800">{line || '\u00A0'}</div>;
      })}
    </div>
  );
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Drop the situation. I'll tell you the move and the exact text to send.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

  // Check auth and subscription status on mount
  useEffect(() => {
    const checkAuthAndSubscription = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login";
          return;
        }

        // Check subscription status
        const response = await fetch("/api/check-subscription");
        const data = await response.json();

        setSubscriptionActive(data.active);
        setCheckingAuth(false);
      } catch (err) {
        console.error("Auth check error:", err);
        window.location.href = "/login";
      }
    };

    checkAuthAndSubscription();
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMsgs: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(nextMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMsgs }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        throw new Error(data?.reply || `HTTP ${res.status}`);
      }

      setMsgs([...nextMsgs, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      setMsgs([
        ...nextMsgs,
        { role: "assistant", content: err?.message || "Unknown error" },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const handleLogout = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error("Failed to open portal:", err);
      alert("Failed to open billing portal");
    }
  };

  // Show loading state while checking auth
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-red-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      </div>
    );
  }

  // Show subscription required if not active
  if (!subscriptionActive) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 px-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Subscription Required</h2>
          <p className="text-gray-600">
            You need an active subscription to use AI Domo.
          </p>
          <a
            href="/pricing"
            className="btn-premium inline-block rounded-2xl px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105"
          >
            Subscribe Now
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-sm text-gray-600 hover:text-gray-800"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-red-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b-2 border-red-200 bg-red-600/95 backdrop-blur-xl shadow-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg overflow-hidden">
              <Image src="/icon.jpg" alt="AI Domo" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Domo</h1>
              <p className="text-xs text-red-100 font-medium">Dating Coach</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleManageSubscription}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Manage
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-red-50/50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="space-y-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex animate-fade-in ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`group relative max-w-[85%] sm:max-w-[75%] ${
                    m.role === "user"
                      ? "rounded-2xl rounded-tr-sm bg-gradient-to-br from-red-600 to-red-500 px-5 py-3.5 text-white shadow-lg"
                      : "rounded-2xl rounded-tl-sm bg-white px-5 py-3.5 text-gray-800 shadow-md border-2 border-red-200"
                  }`}
                >
                  <div className="text-sm leading-relaxed">
                    {m.role === "assistant" ? formatMessage(m.content) : m.content}
                  </div>
                  {m.role === "assistant" && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(m.content);
                        // You could add a toast notification here
                      }}
                      className="absolute -right-2 -top-2 hidden rounded-lg bg-gray-100 p-1.5 text-gray-600 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                      title="Copy message"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-white px-5 py-3.5 shadow-md border-2 border-red-200">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-red-500" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t-2 border-red-200 bg-red-600/95 backdrop-blur-xl shadow-lg">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 rounded-2xl border-2 border-red-300 bg-white p-4 transition-all focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200 focus-within:shadow-lg">
              <textarea
                ref={inputRef}
                className="w-full resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                placeholder="Describe the situation..."
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                disabled={loading}
                style={{ maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="btn-premium flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-red-100">
            Press <kbd className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] text-white">Enter</kbd> to send,{" "}
            <kbd className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] text-white">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
