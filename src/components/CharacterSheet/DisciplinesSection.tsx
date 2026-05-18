import type { Discipline, DisciplinePower, DotRating } from '../../types/vtm5e';
import { ALL_DISCIPLINES } from '../../types/vtm5e';
import DotRating_ from '../ui/DotRating';

interface Props {
  disciplines: Discipline[];
  clanDisciplines: string[];
  onChange: (disciplines: Discipline[]) => void;
}

function PowerRow({
  power,
  onUpdate,
  onRemove,
}: {
  power: DisciplinePower;
  onUpdate: (p: DisciplinePower) => void;
  onRemove: () => void;
}) {
  const levels = [1, 2, 3, 4, 5] as const;
  return (
    <div className="flex items-center gap-2 py-1 group">
      <select
        className="text-xs bg-night-bg border border-night-border text-parchment-muted rounded px-1 py-0.5
                   focus:outline-none focus:border-blood"
        value={power.level}
        onChange={e => onUpdate({ ...power, level: parseInt(e.target.value) as DisciplinePower['level'] })}
      >
        {levels.map(l => (
          <option key={l} value={l} className="bg-night-bg">
            {l}
          </option>
        ))}
      </select>
      <input
        className="flex-1 min-w-0 text-sm text-parchment bg-transparent border-b border-night-border/40
                   focus:outline-none focus:border-blood placeholder:text-parchment-dim/30 italic"
        value={power.name}
        onChange={e => onUpdate({ ...power, name: e.target.value })}
        placeholder="Power name..."
      />
      <button
        type="button"
        onClick={onRemove}
        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-blood-bright hover:text-blood-vivid
                   text-xs transition-opacity"
        aria-label="Remove power"
      >
        ✕
      </button>
    </div>
  );
}

function DisciplineCard({
  discipline,
  isClanDisc,
  onUpdate,
  onRemove,
}: {
  discipline: Discipline;
  isClanDisc: boolean;
  onUpdate: (d: Discipline) => void;
  onRemove: () => void;
}) {
  function addPower() {
    onUpdate({
      ...discipline,
      powers: [...discipline.powers, { id: crypto.randomUUID(), name: '', level: 1 }],
    });
  }

  function updatePower(id: string, updated: DisciplinePower) {
    onUpdate({
      ...discipline,
      powers: discipline.powers.map(p => (p.id === id ? updated : p)),
    });
  }

  function removePower(id: string) {
    onUpdate({ ...discipline, powers: discipline.powers.filter(p => p.id !== id) });
  }

  return (
    <div className="border border-night-border rounded p-3 bg-night-bg">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {isClanDisc && (
              <span className="text-[10px] text-blood border border-blood/40 rounded px-1 py-0.5 font-cinzel uppercase tracking-wider shrink-0">
                Clan
              </span>
            )}
            <select
              className="min-w-0 max-w-full bg-transparent text-parchment font-cinzel text-sm tracking-wide
                         border-0 focus:outline-none cursor-pointer"
              value={discipline.name}
              onChange={e => onUpdate({ ...discipline, name: e.target.value })}
            >
              <option value="" className="bg-night-surface">— Discipline —</option>
              {ALL_DISCIPLINES.map(d => (
                <option key={d} value={d} className="bg-night-surface">
                  {d}
                </option>
              ))}
              <option value="_custom" className="bg-night-surface">Custom...</option>
            </select>
          </div>
        </div>
        <DotRating_
          value={discipline.rating}
          max={5}
          onChange={v => onUpdate({ ...discipline, rating: v as DotRating })}
        />
        <button
          type="button"
          onClick={onRemove}
          className="text-blood hover:text-blood-vivid text-xs transition-colors ml-1"
          aria-label="Remove discipline"
        >
          ✕
        </button>
      </div>

      {discipline.powers.map(p => (
        <PowerRow
          key={p.id}
          power={p}
          onUpdate={updated => updatePower(p.id, updated)}
          onRemove={() => removePower(p.id)}
        />
      ))}

      <button
        type="button"
        onClick={addPower}
        className="mt-1 text-xs text-parchment-dim hover:text-blood-bright transition-colors"
      >
        + add power
      </button>
    </div>
  );
}

export default function DisciplinesSection({ disciplines, clanDisciplines, onChange }: Props) {
  function addDiscipline() {
    onChange([
      ...disciplines,
      { id: crypto.randomUUID(), name: '', rating: 0, powers: [] },
    ]);
  }

  function updateDiscipline(id: string, updated: Discipline) {
    onChange(disciplines.map(d => (d.id === id ? updated : d)));
  }

  function removeDiscipline(id: string) {
    onChange(disciplines.filter(d => d.id !== id));
  }

  return (
    <div className="panel">
      <h3 className="font-cinzel text-gold text-sm tracking-widest uppercase mb-4">Disciplines</h3>

      <div className="space-y-3">
        {disciplines.map(d => (
          <DisciplineCard
            key={d.id}
            discipline={d}
            isClanDisc={clanDisciplines.includes(d.name)}
            onUpdate={updated => updateDiscipline(d.id, updated)}
            onRemove={() => removeDiscipline(d.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addDiscipline}
        className="mt-3 w-full py-1.5 border border-dashed border-night-borderLight text-parchment-dim
                   hover:border-blood hover:text-blood-bright text-sm font-cinzel tracking-wide
                   transition-colors rounded"
      >
        + Add Discipline
      </button>
    </div>
  );
}
