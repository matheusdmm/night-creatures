import { useState } from 'react';
import { rollDice } from '../../lib/api';
import type { RollResult, ResultType } from '../../lib/api';

interface Props {
  defaultPool?: number;
  hunger: number;
}

const RESULT_META: Record<
  ResultType,
  { label: string; color: string; desc: string }
> = {
  critical_win: {
    label: 'Critical Win',
    color: 'text-gold-bright',
    desc: 'Two or more tens. Exceptional success.',
  },
  messy_critical: {
    label: 'Messy Critical',
    color: 'text-blood-vivid',
    desc: 'Critical success tainted by the Beast.',
  },
  success: {
    label: 'Success',
    color: 'text-parchment',
    desc: 'Difficulty met.',
  },
  failure: {
    label: 'Failure',
    color: 'text-parchment-dim',
    desc: 'Not enough successes.',
  },
  bestial_failure: {
    label: 'Bestial Failure',
    color: 'text-blood-bright',
    desc: 'Failed. The Beast stirs.',
  },
};

function DieFace({ value, isHunger }: { value: number; isHunger: boolean }) {
  const isSuccess = value >= 6;
  const isTen = value === 10;
  const isOne = value === 1;

  let bg = 'bg-night-surface3 border-night-borderLight text-parchment-dim';
  if (isHunger) {
    if (isTen)
      bg =
        'bg-blood border-blood-vivid text-parchment font-bold ring-1 ring-gold';
    else if (isOne)
      bg = 'bg-blood-dark border-blood-vivid text-blood-vivid font-bold';
    else if (isSuccess) bg = 'bg-blood/60 border-blood-bright text-parchment';
    else bg = 'bg-night-surface3 border-blood/40 text-parchment-dim';
  } else {
    if (isTen)
      bg =
        'bg-night-surface border-gold text-gold-bright font-bold ring-1 ring-gold/40';
    else if (isSuccess)
      bg = 'bg-night-surface2 border-blood-bright/60 text-parchment';
    else bg = 'bg-night-surface border-night-border text-parchment-dim';
  }

  return (
    <div
      className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-cinzel transition-all ${bg}`}
      title={isHunger ? 'Hunger die' : 'Regular die'}
    >
      {value}
    </div>
  );
}

export default function DiceRoller({ defaultPool = 4, hunger }: Props) {
  const [pool, setPool] = useState(defaultPool);
  const [difficulty, setDifficulty] = useState(1);
  const [result, setResult] = useState<RollResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRoll() {
    setLoading(true);
    setError('');
    try {
      const r = await rollDice(Math.max(1, pool), hunger, difficulty);
      setResult(r);
    } catch {
      setError('Could not reach the dice server.');
    } finally {
      setLoading(false);
    }
  }

  const meta = result ? RESULT_META[result.result_type] : null;

  return (
    <div className="panel-dark space-y-3">
      <h3 className="font-cinzel text-gold text-sm tracking-widest uppercase">
        Dice Roller
      </h3>

      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col gap-0.5">
          <label className="field-label">Pool</label>
          <input
            type="number"
            min={1}
            max={30}
            value={pool}
            onChange={(e) => setPool(Number(e.target.value))}
            className="w-14 field-input text-center"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label className="field-label">Hunger</label>
          <input
            type="number"
            min={0}
            max={5}
            value={hunger}
            readOnly
            className="w-14 field-input text-center opacity-60 cursor-not-allowed"
            title="Synced from sheet"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label className="field-label">Difficulty</label>
          <input
            type="number"
            min={1}
            max={10}
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="w-14 field-input text-center"
          />
        </div>

        <button
          type="button"
          onClick={handleRoll}
          disabled={loading}
          className="bg-blood hover:bg-blood-bright text-[#e8dcc8] font-cinzel text-xs
                     tracking-widest uppercase px-4 py-2 rounded transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '…' : 'Roll'}
        </button>
      </div>

      {error && (
        <p className="text-blood-bright text-xs font-serif italic">{error}</p>
      )}

      {result && meta && (
        <div className="space-y-2 border-t border-night-border pt-3">
          {/* Dice faces */}
          <div className="flex flex-wrap gap-1.5">
            {result.regular_dice.map((v, i) => (
              <DieFace key={`r${i}`} value={v} isHunger={false} />
            ))}
            {result.hunger_dice.map((v, i) => (
              <DieFace key={`h${i}`} value={v} isHunger={true} />
            ))}
          </div>

          {/* Legend */}
          {result.hunger_dice.length > 0 && (
            <p className="text-[10px] text-parchment-dim font-cinzel tracking-wider">
              <span className="text-parchment-dim">□ regular</span>
              {' · '}
              <span className="text-blood-bright">□ hunger</span>
            </p>
          )}

          {/* Result */}
          <div>
            <p className={`font-cinzel text-lg tracking-wide ${meta.color}`}>
              {meta.label}
            </p>
            <p className="text-parchment-muted text-xs font-serif italic">
              {meta.desc}
            </p>
            <p className="text-parchment text-sm font-cinzel mt-1">
              {result.successes} success{result.successes !== 1 ? 'es' : ''}{' '}
              <span className="text-parchment-dim text-xs">
                (margin: {result.margin >= 0 ? '+' : ''}
                {result.margin})
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
