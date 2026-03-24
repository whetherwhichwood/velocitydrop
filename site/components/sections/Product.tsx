'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Coins, Gamepad2, Layers, Server } from 'lucide-react';

const bullets = [
  {
    icon: Coins,
    title: 'Tokens, not subscriptions',
    body: 'Pay for capacity when you use it. No guilt for a server sitting empty all month.',
  },
  {
    icon: Gamepad2,
    title: 'Growing library',
    body: 'Dedicated servers per supported title: containerized, portable, and ready to add more games over time.',
  },
  {
    icon: Layers,
    title: 'Discord-native',
    body: 'Slash commands, clear status, and a flow that feels like part of your server.',
  },
  {
    icon: Server,
    title: 'Shared power, smart allocation',
    body: 'Admins pool hardware; users get fair slots. Scale out when the community grows.',
  },
];

export function Product() {
  const reduce = useReducedMotion();

  return (
    <section id="product" className="scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading">Built for “let’s play tonight”</h2>
          <p className="section-sub">
            VelocityDrop connects Discord to your game stack: request a server, burn a token, play. When you are
            done, resources go back to the pool. Simple for players; operable for the team running the
            infrastructure.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {bullets.map((item, i) => (
            <motion.div
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="glass-panel p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric-500/15 text-electric-400 ring-1 ring-electric-400/20">
                <item.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
