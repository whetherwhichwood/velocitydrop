'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function About() {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-heading">About VelocityDrop</h2>
            <p className="section-sub">
              We are building a product layer for on-demand game hosting: Discord as the control plane, containers
              for game worlds, and a token economy so users only pay when they actually spin something up.
            </p>
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="glass-panel space-y-4 p-8 text-slate-300"
          >
            <p className="font-medium text-white">Who it is for</p>
            <p className="text-sm leading-relaxed">
              Friend groups, small communities, and creators who want a dedicated server for sessions, not a
              24/7 bill. Admins who are comfortable managing pooled resources and token grants.
            </p>
            <p className="font-medium text-white pt-2">What is real today</p>
            <p className="text-sm leading-relaxed">
              The Discord bot, API, resource pool, and game-server provisioning path are in active development in
              the open. This site is the public face; the demo below is illustrative only. No backend calls from
              your browser.
            </p>
            <p className="font-medium text-white pt-2">Roadmap</p>
            <p className="text-sm leading-relaxed">
              More games, hosted deployment options, and purchase flows for tokens beyond manual admin grants.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
