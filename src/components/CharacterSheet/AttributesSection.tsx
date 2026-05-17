import type { Attributes, DotRating } from '../../types/vtm5e';
import DotRating_ from '../ui/DotRating';

interface Props {
  attributes: Attributes;
  onChange: (attributes: Attributes) => void;
}

const PHYSICAL = ['strength', 'dexterity', 'stamina'] as const;
const SOCIAL = ['charisma', 'manipulation', 'composure'] as const;
const MENTAL = ['intelligence', 'wits', 'resolve'] as const;

function AttributeRow({
  name,
  value,
  onChange,
}: {
  name: string;
  value: DotRating;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-night-border/50 last:border-0">
      <span className="text-parchment text-sm font-serif capitalize">{name}</span>
      <DotRating_ value={value} max={5} onChange={v => onChange(Math.max(1, v) as DotRating)} />
    </div>
  );
}

function Group({
  title,
  attrs,
  attributes,
  onChange,
}: {
  title: string;
  attrs: ReadonlyArray<keyof Attributes>;
  attributes: Attributes;
  onChange: (key: keyof Attributes, v: number) => void;
}) {
  return (
    <div>
      <h4 className="section-title">{title}</h4>
      {attrs.map(key => (
        <AttributeRow
          key={key}
          name={key}
          value={attributes[key]}
          onChange={v => onChange(key, v)}
        />
      ))}
    </div>
  );
}

export default function AttributesSection({ attributes, onChange }: Props) {
  function handleChange(key: keyof Attributes, v: number) {
    onChange({ ...attributes, [key]: v as DotRating });
  }

  return (
    <div className="panel">
      <h3 className="font-cinzel text-gold text-sm tracking-widest uppercase mb-4">Attributes</h3>
      <div className="space-y-4">
        <Group title="Physical" attrs={PHYSICAL} attributes={attributes} onChange={handleChange} />
        <Group title="Social" attrs={SOCIAL} attributes={attributes} onChange={handleChange} />
        <Group title="Mental" attrs={MENTAL} attributes={attributes} onChange={handleChange} />
      </div>
    </div>
  );
}
