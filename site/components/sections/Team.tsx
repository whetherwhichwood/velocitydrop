'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

const placeholders = [
  {
    initials: '?',
    name: 'Name TBD',
    role: 'Product & operations',
    gradient: 'from-electric-500/40 to-cyan-600/30',
  },
  {
    initials: '?',
    name: 'Name TBD',
    role: 'Engineering & infra',
    gradient: 'from-violet-500/40 to-fuchsia-600/30',
  },
];

export function Team() {
  const reduce = useReducedMotion();

  return (
    <section id="team" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading">Team</h2>
          <p className="section-sub">
            Profiles and links will go here. For now, meet the placeholders behind the build.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {placeholders.map((p, i) => (
            <motion.article
              key={i}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="glass-panel flex flex-col p-8"
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient} font-display text-xl font-bold text-white ring-1 ring-white/10`}
              >
                {p.initials}
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-white">{p.name}</h3>
              <p className="text-sm font-medium text-electric-400">{p.role}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Bio coming soon. We will drop a short story, focus areas, and how to reach us for partnerships
                or support.
              </p>
              <div className="mt-6 flex gap-3">
                <span
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs font-medium text-slate-500"
                  title="Link coming soon"
                >
                  <Linkedin className="h-4 w-4" aria-hidden />
                  LinkedIn
                </span>
                <span
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs font-medium text-slate-500"
                  title="Link coming soon"
                >
                  <Github className="h-4 w-4" aria-hidden />
                  GitHub
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
