'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { getDiscordInviteUrl } from '@/lib/public-env';

const links = [
  { href: '#product', label: 'Product' },
  { href: '#games', label: 'Games' },
  { href: '#demo', label: 'Demo' },
  { href: '#about', label: 'About' },
  { href: '#story', label: 'Story' },
  { href: '#team', label: 'Team' },
];

export function Nav() {
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={reduce ? false : { y: -12, opacity: 0 }}
      animate={reduce ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-surface-950/75 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#" className="group flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-electric-500/30 to-zap-500/20 text-electric-400 ring-1 ring-white/10 transition group-hover:ring-electric-400/40">
            <Zap className="h-5 w-5" aria-hidden />
          </span>
          VelocityDrop
        </a>

        <nav
          className="-mx-1 flex max-w-[min(100vw-12rem,28rem)] items-center gap-0.5 overflow-x-auto px-1 md:max-w-none"
          aria-label="Primary"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white sm:text-sm md:px-3"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={getDiscordInviteUrl()}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-electric-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-surface-950 shadow-glow transition hover:brightness-110"
          >
            Add to Discord
          </a>
        </div>
      </div>
    </motion.header>
  );
}
