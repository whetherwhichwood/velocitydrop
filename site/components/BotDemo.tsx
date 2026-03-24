'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bot, Hash, Terminal, User } from 'lucide-react';

type Role = 'user' | 'bot';

type ChatLine = {
  id: string;
  role: Role;
  content: string;
};

const DEMO_CHANNEL = 'velocitydrop-demo';

const RESPONSES: Record<string, string> = {
  '/server create': `**Server Created**\nName: \`Northwind\` · Status: stopped\n_Use /server start and pick a supported game when you are ready._`,
  '/server start': `**Server Starting**\nProvisioning container… Port will appear in \`/server status\`.\n_(This is a demo; no real servers are started.)_`,
  '/server stop': `**Server Stopping**\nSending stop signal…\n_(Demo only.)_`,
  '/server status': `**Server Status: Northwind**\nStatus: **running** · Port: \`2456\``,
  '/server list': `**Your Servers**\n• **Northwind** (stopped)`,
  '/tokens balance': `**Token Balance**\nYou have **12** tokens.`,
  '/admin tokens': `**Permission denied**\nYou need administrator permissions in this Discord server.`,
};

const QUICK_COMMANDS = [
  '/server create',
  '/server start',
  '/server stop',
  '/server status',
  '/server list',
  '/tokens balance',
  '/admin tokens',
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function BotDemo() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [messages, setMessages] = useState<ChatLine[]>([
    {
      id: 'welcome',
      role: 'bot',
      content:
        'Welcome to the **VelocityDrop** demo. Pick a slash command below. This is a mock Discord thread; nothing hits our backend.',
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const key = QUICK_COMMANDS.find((c) => c === trimmed) ?? trimmed;
    const reply = RESPONSES[key] ?? RESPONSES[trimmed];

    setMessages((prev) => [...prev, { id: uid(), role: 'user', content: trimmed }]);
    setTyping(true);

    const delay = reduce ? 0 : 520 + Math.floor(Math.random() * 280);

    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'bot',
          content:
            reply ??
            `Unknown command: \`${trimmed}\`\nTry one of the suggested commands below.`,
        },
      ]);
    }, delay);
  }, [reduce]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
  };

  return (
    <div
      className="glass-panel overflow-hidden"
      role="region"
      aria-labelledby={titleId}
    >
      <div className="flex justify-between gap-4 border-b border-white/[0.06] bg-black/20 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Terminal className="h-4 w-4 text-electric-400" aria-hidden />
          <span id={titleId} className="font-medium text-white">
            Interactive preview
          </span>
          <span className="hidden text-slate-500 sm:inline">· mock only</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-b border-white/[0.06] bg-black/20 p-4 lg:block lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Text channels
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-electric-500/10 px-2 py-2 text-sm text-electric-300 ring-1 ring-electric-400/25">
            <Hash className="h-4 w-4 shrink-0" aria-hidden />
            {DEMO_CHANNEL}
          </div>
        </aside>

        <div className="flex min-h-[320px] flex-col sm:min-h-[380px]">
          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5"
            style={{ maxHeight: 'min(52vh, 420px)' }}
          >
            {messages.map((m) => (
              <motion.div
                key={m.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-white/10 ${
                    m.role === 'user'
                      ? 'bg-zap-500/20 text-zap-400'
                      : 'bg-electric-500/20 text-electric-400'
                  }`}
                >
                  {m.role === 'user' ? <User className="h-4 w-4" aria-hidden /> : <Bot className="h-4 w-4" aria-hidden />}
                </div>
                <div
                  className={`max-w-[min(100%,520px)] rounded-2xl px-4 py-3 text-sm leading-relaxed text-slate-200 ${
                    m.role === 'user'
                      ? 'bg-zap-500/10 ring-1 ring-zap-500/20'
                      : 'bg-surface-800/90 ring-1 ring-white/[0.06]'
                  }`}
                >
                  <MessageBody text={m.content} />
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {typing && (
                <motion.div
                  initial={reduce ? false : { opacity: 0 }}
                  animate={reduce ? undefined : { opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-electric-500/20 text-electric-400 ring-1 ring-white/10">
                    <Bot className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-surface-800/90 px-4 py-3 ring-1 ring-white/[0.06]">
                    <span className="sr-only">Bot is typing</span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-electric-400 [animation-delay:-0.2s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-electric-400 [animation-delay:-0.1s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-electric-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/[0.06] bg-black/20 px-4 py-3 sm:px-5">
            <p className="mb-2 text-xs text-slate-500">Try a command (demo)</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => runCommand(cmd)}
                  disabled={typing}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-xs font-mono text-electric-300 transition hover:border-electric-400/40 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cmd}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="mt-3 flex gap-2">
              <label htmlFor="demo-input" className="sr-only">
                Type a slash command
              </label>
              <input
                id="demo-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="/server create"
                disabled={typing}
                className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2 font-mono text-sm text-white placeholder:text-slate-600 focus:border-electric-400/40 focus:outline-none focus:ring-2 focus:ring-electric-400/20 disabled:opacity-50"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={typing || !input.trim()}
                className="rounded-xl bg-gradient-to-r from-electric-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-surface-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBody({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part === '\n') return <br key={i} />;
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[0.85em] text-zap-300"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}
