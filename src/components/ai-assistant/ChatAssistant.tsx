"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Challenge, ChatMessage, LiveActivity } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import { usePublications } from "@/hooks/usePublications";
import {
  buildAdvisorContext,
  createChatMessage,
  createWelcomeMessage,
  queryAdvisor,
} from "@/lib/services/aiAdvisorService";
import { SalkynAvatar } from "./SalkynAvatar";
import { Button } from "@/components/ui/Button";
import { X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_PROMPTS = [
  "Мне скучно, мы на Магистрали, куда пойти?",
  "Где дешёво перекусить?",
  "Что сейчас live на карте?",
];

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  liveChallenges: Challenge[];
  liveActivities: LiveActivity[];
}

export function ChatAssistant({
  isOpen,
  onClose,
  liveChallenges,
  liveActivities,
}: ChatAssistantProps) {
  const { user } = useUser();
  const { publications } = usePublications();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getContext = useCallback(
    () =>
      buildAdvisorContext(user, publications, liveChallenges, liveActivities),
    [user, publications, liveChallenges, liveActivities]
  );

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([createChatMessage("assistant", createWelcomeMessage(getContext()))]);
    }
  }, [isOpen, messages.length, getContext]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput("");
    setMessages((prev) => [...prev, createChatMessage("user", trimmed)]);
    setLoading(true);

    try {
      const context = getContext();
      const { reply } = await queryAdvisor(trimmed, context);
      setMessages((prev) => [...prev, createChatMessage("assistant", reply)]);
    } catch {
      setMessages((prev) => [
        ...prev,
        createChatMessage(
          "assistant",
          "Блин, связь моргнула 🫠 Попробуй ещё раз — я на связи с картой и Публикациями!"
        ),
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-x-0 bottom-0 z-[70] px-3 pb-20 max-w-lg mx-auto animate-slide-up"
        role="dialog"
        aria-label="AI Ассистент Салкын"
      >
        <div
          className="rounded-3xl border-2 border-cyan-500/40 bg-slate-900/98 backdrop-blur-xl overflow-hidden flex flex-col h-[min(72dvh,520px)]"
          style={{ boxShadow: "0 -8px 40px rgba(6, 182, 212, 0.2)" }}
        >
          <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10">
            <SalkynAvatar size="md" />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-black text-white">AI Ассистент Салкын</h2>
              <p className="text-[10px] text-cyan-400/80 truncate">
                Context Advisor · Публикации + Radar + Profile
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              aria-label="Закрыть чат"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {msg.role === "assistant" && <SalkynAvatar size="sm" className="shrink-0 mt-0.5" />}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-md"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center">
                <SalkynAvatar size="sm" />
                <div className="bg-slate-800 border border-cyan-500/30 rounded-2xl px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-300 transition-all disabled:opacity-50"
              >
                {prompt.length > 36 ? `${prompt.slice(0, 36)}…` : prompt}
              </button>
            ))}
          </div>

          <form
            className="p-3 border-t border-slate-800 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спроси Салкына... куда пойти? скучно?"
              disabled={loading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
            />
            <Button
              type="submit"
              variant="neon"
              size="md"
              disabled={!input.trim() || loading}
              aria-label="Отправить"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-[9px] text-center text-slate-600 pb-2 px-3 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            Анализирует Публикации, live-карту и твой профиль
          </p>
        </div>
      </div>
    </>
  );
}
