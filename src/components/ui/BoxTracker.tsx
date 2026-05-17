import type { BoxState } from '../../types/vtm5e';

interface Props {
  boxes: BoxState[];
  onChange?: (boxes: BoxState[]) => void;
  variant?: 'health' | 'willpower' | 'hunger';
}

const CYCLE: Record<BoxState, BoxState> = {
  empty: 'superficial',
  superficial: 'aggravated',
  aggravated: 'empty',
};

export default function BoxTracker({ boxes, onChange, variant = 'health' }: Props) {
  function handleClick(index: number) {
    if (!onChange) return;
    const next = [...boxes];
    next[index] = CYCLE[next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {boxes.map((state, i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleClick(i)}
          disabled={!onChange}
          className={`
            w-6 h-6 border rounded-sm transition-all duration-150 flex items-center justify-center
            ${onChange ? 'cursor-pointer' : 'cursor-default'}
            ${boxStyle(state, variant)}
          `}
          title={state}
          aria-label={`Box ${i + 1}: ${state}`}
        >
          {state === 'aggravated' && (
            <svg viewBox="0 0 10 10" className="w-3 h-3">
              <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}

function boxStyle(state: BoxState, variant: Props['variant']): string {
  if (state === 'empty') {
    return 'bg-transparent border-parchment-dim/40 text-transparent';
  }
  if (state === 'superficial') {
    return variant === 'willpower'
      ? 'bg-parchment-muted/70 border-parchment-muted text-parchment-muted'
      : 'bg-blood/70 border-blood-bright text-blood-bright';
  }
  // aggravated
  return 'bg-night-bg border-blood-bright text-blood-bright';
}
