import { Github } from 'lucide-react';
import { getGithubRepoUrl } from '@/lib/public-env';

export function Footer() {
  const year = new Date().getFullYear();
  const repo = getGithubRepoUrl();

  return (
    <footer className="border-t border-white/[0.06] bg-surface-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg font-bold text-white">VelocityDrop</p>
          <p className="mt-1 text-sm text-slate-500">Game servers on demand. Tokens, not idle rent.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <a href="#product" className="transition hover:text-white">
            Product
          </a>
          <a href="#games" className="transition hover:text-white">
            Games
          </a>
          <a href="#demo" className="transition hover:text-white">
            Demo
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-white"
          >
            <Github className="h-4 w-4" aria-hidden />
            GitHub
          </a>
        </div>
        <p className="text-sm text-slate-600 sm:text-right">© {year} VelocityDrop</p>
      </div>
    </footer>
  );
}
