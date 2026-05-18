import { Link } from 'react-router-dom';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-night-border bg-night-surface mt-10">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="max-w-xs">
            <p className="font-cinzel text-parchment text-lg tracking-wide mb-2">
              Night Creatures
            </p>
            <p className="text-parchment-dim text-sm leading-relaxed">
              Character builder for Vampire: The Masquerade V5. Local first,
              just like darkness.
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2.5">
              <p className="text-[10px] text-parchment-dim uppercase tracking-widest mb-1">
                App
              </p>
              <Link
                to="/"
                className="text-parchment-dim hover:text-parchment transition-colors"
              >
                Home
              </Link>
              <Link
                to="/guide"
                className="text-parchment-dim hover:text-parchment transition-colors"
              >
                How to Play
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="text-[10px] text-parchment-dim uppercase tracking-widest mb-1">
                Also by Matheus
              </p>
              <a
                href="https://www.tomeofchanges.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment-dim hover:text-parchment transition-colors"
              >
                Tome of Changes
              </a>
              <a
                href="https://heroscribe.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment-dim hover:text-parchment transition-colors"
              >
                HeroScribe
              </a>
              <a
                href="https://matheusdmm.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment-dim hover:text-parchment transition-colors"
              >
                matheusdmm.dev
              </a>
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-night-border pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-parchment-dim">
          <p>
            © {year} Night Creatures. Built by{' '}
            <a
              href="https://matheusdmm.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-parchment transition-colors"
            >
              Matheus
            </a>
            .
          </p>
          <p className="italic font-serif">
            Vampire: The Masquerade is owned by Paradox Interactive. This is an
            unofficial fan tool.
          </p>
        </div>
      </div>
    </footer>
  );
}
