import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const itemClass =
    'flex w-full items-center gap-2 px-4 py-2.5 text-xs font-cinzel tracking-widest uppercase ' +
    'text-parchment-dim hover:text-parchment hover:bg-night-border/30 transition-colors text-left';

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Open menu"
        aria-expanded={open}
        className={`flex flex-col justify-center gap-[4px] w-8 h-8 rounded border transition-colors
          ${open
            ? 'border-blood text-blood-bright'
            : 'border-night-borderLight text-parchment-dim hover:border-blood hover:text-parchment'
          }`}
      >
        <span className={`block mx-auto h-px w-4 bg-current transition-transform origin-center
          ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
        <span className={`block mx-auto h-px w-4 bg-current transition-opacity
          ${open ? 'opacity-0' : ''}`} />
        <span className={`block mx-auto h-px w-4 bg-current transition-transform origin-center
          ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 min-w-[160px] rounded border border-night-border
                        bg-night-surface shadow-lg z-20 overflow-hidden">
          <Link
            to="/guide"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            How to Play
          </Link>
        </div>
      )}
    </div>
  );
}
