'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getDiscordInviteUrl } from '@/lib/public-env';

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative px-4 pb-20 pt-28 sm:px-6 sm:pt-32 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-electric-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Discord · On-demand · Tokens
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Spin up game servers{' '}
            <span className="text-gradient">without paying for idle months</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
            VelocityDrop is a Discord bot that provisions dedicated game servers when you need them, not when you
            do not. Buy tokens, spin up a world when your crew is online, and skip the always-on monthly bill.
            Built for players and teams; built to scale with shared backend capacity.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={getDiscordInviteUrl()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric-500 to-cyan-500 px-6 py-3.5 text-base font-semibold text-surface-950 shadow-glow transition hover:brightness-110"
            >
              Add to Discord
              <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.03] px-6 py-3.5 text-base font-semibold text-white transition hover:border-electric-400/40 hover:bg-white/[0.06]"
            >
              Try the interactive demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
