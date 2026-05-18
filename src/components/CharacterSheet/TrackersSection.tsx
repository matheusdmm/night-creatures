import type { Character, BoxState } from '../../types/vtm5e';
import BoxTracker from '../ui/BoxTracker';
import DotRating from '../ui/DotRating';

interface Props {
  character: Character;
  onChange: (updates: Partial<Character>) => void;
}

function TrackerBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="field-label">{label}</span>
      {children}
    </div>
  );
}

export default function TrackersSection({ character, onChange }: Props) {
  const hungerBoxes: BoxState[] = Array.from({ length: 5 }, (_, i) =>
    i < character.hunger ? 'superficial' : 'empty'
  );

  function handleHungerClick(boxes: BoxState[]) {
    const filled = boxes.filter(b => b !== 'empty').length;
    onChange({ hunger: filled });
  }

  return (
    <div className="panel">
      <h3 className="font-cinzel text-gold text-sm tracking-widest uppercase mb-4">Trackers</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <TrackerBlock label="Health">
          <BoxTracker
            boxes={character.health}
            variant="health"
            onChange={boxes => onChange({ health: boxes })}
          />
          <p className="text-[10px] text-parchment-dim italic">Stamina + 3 boxes</p>
        </TrackerBlock>

        <TrackerBlock label="Willpower">
          <BoxTracker
            boxes={character.willpower}
            variant="willpower"
            onChange={boxes => onChange({ willpower: boxes })}
          />
          <p className="text-[10px] text-parchment-dim italic">Composure + Resolve boxes</p>
        </TrackerBlock>

        <TrackerBlock label={`Hunger — ${character.hunger}/5`}>
          <BoxTracker
            boxes={hungerBoxes}
            variant="hunger"
            onChange={handleHungerClick}
          />
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => onChange({ hunger: Math.max(0, character.hunger - 1) })}
              disabled={character.hunger === 0}
              className="px-2 py-0.5 text-xs border border-parchment-dim/40 rounded text-parchment-dim hover:border-blood hover:text-blood disabled:opacity-30 disabled:cursor-default transition-colors"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => onChange({ hunger: Math.min(5, character.hunger + 1) })}
              disabled={character.hunger === 5}
              className="px-2 py-0.5 text-xs border border-parchment-dim/40 rounded text-parchment-dim hover:border-blood hover:text-blood disabled:opacity-30 disabled:cursor-default transition-colors"
            >
              +
            </button>
          </div>
        </TrackerBlock>

        <TrackerBlock label={`Humanity — ${character.humanity}/10`}>
          <DotRating
            value={character.humanity}
            max={10}
            color="gold"
            onChange={v => onChange({ humanity: v })}
          />
        </TrackerBlock>

        <TrackerBlock label={`Blood Potency — ${character.bloodPotency}/10`}>
          <DotRating
            value={character.bloodPotency}
            max={10}
            color="blood"
            onChange={v => onChange({ bloodPotency: v })}
          />
        </TrackerBlock>
      </div>
    </div>
  );
}
