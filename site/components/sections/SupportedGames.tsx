'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Gamepad2, Hourglass, Shield } from 'lucide-react';

const supported = [
  {
    name: 'Valheim',
    status: 'available' as const,
    blurb: 'Co-op survival with a dedicated world. Spin it up when your group is ready to play.',
    icon: Shield,
  },
];

export function SupportedGames() {
  const reduce = useReducedMotion();

  return (
    <section id="games" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading">Supported games</h2>
          <p className="section-sub">
            VelocityDrop is built to support many dedicated-server titles. We ship integrations as they are ready.
            Start here, with more on the way soon.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {supported.map((game, i) => (
            <motion.article
              key={game.name}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="glass-panel flex flex-col p-6 ring-1 ring-electric-400/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric-500/15 text-electric-400 ring-1 ring-electric-400/25">
                  <game.icon className="h-5 w-5" aria-hidden />
                </div>
                <span className="rounded-full bg-electric-500/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-electric-300">
                  Available
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-white">{game.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{game.blurb}</p>
            </motion.article>
          ))}

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="glass-panel flex flex-col justify-center border border-dashed border-white/[0.12] bg-white/[0.02] p-6 text-center"
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500 ring-1 ring-white/[0.08]">
              <Hourglass className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-slate-300">More games coming soon</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              We are prioritizing stable, fair hosting per title. Want a specific game? Follow along as we expand
              the catalog.
            </p>
            <div className="mt-4 inline-flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
              <Gamepad2 className="h-4 w-4" aria-hidden />
              Roadmap-driven releases
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
