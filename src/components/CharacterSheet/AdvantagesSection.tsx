import type { Advantage, DotRating } from '../../types/vtm5e';
import DotRating_ from '../ui/DotRating';

interface Props {
  backgrounds: Advantage[];
  merits: Advantage[];
  flaws: Advantage[];
  onChange: (
    category: 'backgrounds' | 'merits' | 'flaws',
    items: Advantage[]
  ) => void;
}

function AdvantageRow({
  item,
  category,
  onUpdate,
  onRemove,
}: {
  item: Advantage;
  category: 'backgrounds' | 'merits' | 'flaws';
  onUpdate: (updated: Advantage) => void;
  onRemove: () => void;
}) {
  const isFlaws = category === 'flaws';
  return (
    <div className="border-b border-night-border/40 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0 group">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 min-w-0 text-sm text-parchment bg-transparent border-b border-night-border/30
                     focus:outline-none focus:border-blood placeholder:text-parchment-dim/30"
          value={item.name}
          onChange={e => onUpdate({ ...item, name: e.target.value })}
          placeholder="Name..."
        />
        {!isFlaws && (
          <DotRating_
            value={item.rating}
            max={5}
            size="sm"
            onChange={v => onUpdate({ ...item, rating: v as DotRating })}
          />
        )}
        {isFlaws && (
          <DotRating_
            value={item.rating}
            max={5}
            size="sm"
            color="blood"
            onChange={v => onUpdate({ ...item, rating: v as DotRating })}
          />
        )}
        <button
          type="button"
          onClick={onRemove}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-blood-bright hover:text-blood-vivid
                     text-xs transition-opacity"
        >
          ✕
        </button>
      </div>
      <input
        className="mt-0.5 w-full text-xs text-parchment-dim bg-transparent border-b border-night-border/20
                   focus:outline-none focus:border-blood/40 placeholder:text-parchment-dim/20 italic"
        value={item.description}
        onChange={e => onUpdate({ ...item, description: e.target.value })}
        placeholder="Description..."
      />
    </div>
  );
}

function AdvantageGroup({
  title,
  category,
  items,
  onChange,
}: {
  title: string;
  category: 'backgrounds' | 'merits' | 'flaws';
  items: Advantage[];
  onChange: Props['onChange'];
}) {
  function addItem() {
    onChange(category, [
      ...items,
      { id: crypto.randomUUID(), name: '', rating: 0, description: '' },
    ]);
  }

  function updateItem(id: string, updated: Advantage) {
    onChange(category, items.map(i => (i.id === id ? updated : i)));
  }

  function removeItem(id: string) {
    onChange(category, items.filter(i => i.id !== id));
  }

  return (
    <div>
      <h4 className="section-title">{title}</h4>
      {items.map(item => (
        <AdvantageRow
          key={item.id}
          item={item}
          category={category}
          onUpdate={updated => updateItem(item.id, updated)}
          onRemove={() => removeItem(item.id)}
        />
      ))}
      <button
        type="button"
        onClick={addItem}
        className="text-xs text-parchment-dim hover:text-blood-bright transition-colors mt-1"
      >
        + Add {title.slice(0, -1)}
      </button>
    </div>
  );
}

export default function AdvantagesSection({ backgrounds, merits, flaws, onChange }: Props) {
  return (
    <div className="panel">
      <h3 className="font-cinzel text-gold text-sm tracking-widest uppercase mb-4">
        Advantages &amp; Flaws
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdvantageGroup
          title="Backgrounds"
          category="backgrounds"
          items={backgrounds}
          onChange={onChange}
        />
        <AdvantageGroup
          title="Merits"
          category="merits"
          items={merits}
          onChange={onChange}
        />
        <AdvantageGroup
          title="Flaws"
          category="flaws"
          items={flaws}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
