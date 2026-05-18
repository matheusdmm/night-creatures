import { useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"  x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2"  y1="12" x2="5"  y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}

type VTDocument = Document & {
  startViewTransition: (cb: () => void) => ViewTransition;
};

const VT_DURATION = 750;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const rafRef = useRef<number | null>(null);

  function handleToggle() {
    const next = theme === 'dark' ? 'light' : 'dark';

    function doSwitch() {
      if (next === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      toggleTheme();
    }

    const circle = document.getElementById('vt-circle') as SVGCircleElement | null;
    const turbulence = document.getElementById('vt-turbulence');

    if (!('startViewTransition' in document) || !circle) {
      doSwitch();
      return;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const bx = window.innerWidth - 30;
    const by = window.innerHeight - 30;
    const maxR = Math.hypot(bx, by) * 1.1;

    circle.setAttribute('cx', String(bx));
    circle.setAttribute('cy', String(by));
    circle.setAttribute('r', '0');

    // Different seed each time for unique organic shape
    turbulence?.setAttribute('seed', String(Math.floor(Math.random() * 99) + 1));

    const transition = (document as VTDocument).startViewTransition(doSwitch);

    transition.ready.then(() => {
      const startTime = performance.now();

      function tick(now: number) {
        const t = Math.min((now - startTime) / VT_DURATION, 1);
        circle.setAttribute('r', String(easeOutCubic(t) * maxR));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    });

    transition.finished.then(() => {
      circle.setAttribute('r', '0');
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={theme === 'dark' ? 'Switch to dawn' : 'Embrace the night'}
      title={theme === 'dark' ? 'Dawn approaches' : 'The night awaits'}
      className="fixed bottom-5 right-5 z-50
                 w-10 h-10 rounded-full flex items-center justify-center
                 bg-night-surface/90 backdrop-blur-sm
                 border border-night-borderLight hover:border-blood
                 text-parchment-dim hover:text-parchment
                 shadow-blood-sm hover:shadow-blood
                 transition-all duration-300"
    >
      <span key={theme} className="theme-icon-swap">
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}
