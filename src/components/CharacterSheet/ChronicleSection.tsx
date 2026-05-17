import type { Character, Touchstone } from '../../types/vtm5e';

interface Props {
  tenets: string[];
  touchstones: Touchstone[];
  notes: string;
  onChange: (updates: Partial<Character>) => void;
}

export default function ChronicleSection({ tenets, touchstones, notes, onChange }: Props) {
  function updateTenet(index: number, value: string) {
    const next = [...tenets];
    next[index] = value;
    onChange({ tenets: next });
  }

  function addTouchstone() {
    onChange({
      touchstones: [
        ...touchstones,
        { id: crypto.randomUUID(), name: '', conviction: '' },
      ],
    });
  }

  function updateTouchstone(id: string, updates: Partial<Touchstone>) {
    onChange({
      touchstones: touchstones.map(t => (t.id === id ? { ...t, ...updates } : t)),
    });
  }

  function removeTouchstone(id: string) {
    onChange({ touchstones: touchstones.filter(t => t.id !== id) });
  }

  return (
    <div className="panel">
      <h3 className="font-cinzel text-gold text-sm tracking-widest uppercase mb-4">Chronicle</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="section-title">Chronicle Tenets</h4>
          <div className="space-y-2">
            {tenets.map((tenet, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-blood-bright font-cinzel text-xs mt-1.5 select-none w-4">
                  {i + 1}.
                </span>
                <input
                  className="flex-1 field-input text-sm"
                  value={tenet}
                  onChange={e => updateTenet(i, e.target.value)}
                  placeholder={`Tenet ${i + 1}...`}
                />
              </div>
            ))}
            {tenets.length < 5 && (
              <button
                type="button"
                onClick={() => onChange({ tenets: [...tenets, ''] })}
                className="text-xs text-parchment-dim hover:text-blood-bright transition-colors ml-6"
              >
                + Add Tenet
              </button>
            )}
          </div>
        </div>

        <div>
          <h4 className="section-title">Touchstones &amp; Convictions</h4>
          <div className="space-y-3">
            {touchstones.map(t => (
              <div key={t.id} className="group border-b border-night-border/40 pb-2 last:border-0">
                <div className="flex gap-2 items-center">
                  <input
                    className="flex-1 field-input text-sm font-serif"
                    value={t.name}
                    onChange={e => updateTouchstone(t.id, { name: e.target.value })}
                    placeholder="Touchstone name..."
                  />
                  <button
                    type="button"
                    onClick={() => removeTouchstone(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-blood hover:text-blood-vivid
                               text-xs transition-opacity"
                  >
                    ✕
                  </button>
                </div>
                <input
                  className="mt-0.5 w-full text-xs text-parchment-dim bg-transparent border-b
                             border-night-border/20 focus:outline-none focus:border-blood/40
                             placeholder:text-parchment-dim/30 italic"
                  value={t.conviction}
                  onChange={e => updateTouchstone(t.id, { conviction: e.target.value })}
                  placeholder="Conviction..."
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTouchstone}
              className="text-xs text-parchment-dim hover:text-blood-bright transition-colors"
            >
              + Add Touchstone
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="section-title">Notes</h4>
        <textarea
          className="w-full bg-night-bg border border-night-border rounded p-3 text-parchment text-sm
                     font-serif focus:outline-none focus:border-blood transition-colors resize-y
                     min-h-[100px] placeholder:text-parchment-dim/30"
          value={notes}
          onChange={e => onChange({ notes: e.target.value })}
          placeholder="Notes, backstory, coterie details..."
        />
      </div>
    </div>
  );
}
