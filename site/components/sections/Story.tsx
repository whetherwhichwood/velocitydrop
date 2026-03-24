'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function Story() {
  const reduce = useReducedMotion();

  return (
    <section id="story" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-surface-800/80 to-surface-900/90 p-8 sm:p-12"
        >
          <Quote className="absolute right-8 top-8 h-16 w-16 text-electric-500/15" aria-hidden />
          <h2 className="section-heading">Founding story</h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-slate-400">
            <p>
              We kept paying for servers that were only alive on Friday nights. The bill did not care about our
              calendar. VelocityDrop started as a simple rule:{' '}
              <span className="font-medium text-slate-200">if nobody is playing, nobody should be paying.</span>
            </p>
            <p>
              Discord is already where squads gather, so it became the natural place to request a world, spend a
              token, and get a link. Tokens align incentives: users get predictable costs, and operators can
              share hardware across many groups without pretending every group needs a dedicated machine.
            </p>
            <p className="text-base text-slate-500">
              This is placeholder narrative copy you can replace with your real founding story as the product
              ships.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
