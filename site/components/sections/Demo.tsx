'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BotDemo } from '@/components/BotDemo';

export function Demo() {
  const reduce = useReducedMotion();

  return (
    <section id="demo" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading">See the bot in action</h2>
          <p className="section-sub">
            Tap a command or type your own. Everything is simulated in the browser. No API calls, no Discord
            tokens, no servers started.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-10"
        >
          <BotDemo />
        </motion.div>
      </div>
    </section>
  );
}
