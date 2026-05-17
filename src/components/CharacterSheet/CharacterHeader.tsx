import type { Character } from '../../types/vtm5e';
import { CLANS, PREDATOR_TYPES } from '../../types/vtm5e';

interface Props {
  character: Character;
  onChange: (updates: Partial<Character>) => void;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? label}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="field-label">{label}</label>
      <select
        className="field-input bg-transparent appearance-none cursor-pointer"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">— select —</option>
        {options.map(o => (
          <option key={o} value={o} className="bg-night-surface text-parchment">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function CharacterHeader({ character, onChange }: Props) {
  return (
    <div className="panel mb-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
        <div className="col-span-2 md:col-span-3">
          <label className="field-label">Name</label>
          <input
            className="field-input text-xl font-cinzel tracking-wide"
            value={character.name}
            onChange={e => onChange({ name: e.target.value })}
            placeholder="Character Name"
          />
        </div>

        <Field label="Player" value={character.player} onChange={v => onChange({ player: v })} />
        <Field label="Chronicle" value={character.chronicle} onChange={v => onChange({ chronicle: v })} />
        <Field label="Concept" value={character.concept} onChange={v => onChange({ concept: v })} />

        <SelectField
          label="Clan"
          value={character.clan}
          options={CLANS}
          onChange={v => onChange({ clan: v })}
        />
        <Field
          label="Generation"
          value={character.generation}
          onChange={v => onChange({ generation: parseInt(v) || 13 })}
        />
        <Field label="Sire" value={character.sire} onChange={v => onChange({ sire: v })} />

        <SelectField
          label="Predator Type"
          value={character.predatorType}
          options={PREDATOR_TYPES}
          onChange={v => onChange({ predatorType: v })}
        />
        <Field label="Ambition" value={character.ambition} onChange={v => onChange({ ambition: v })} />
        <Field label="Desire" value={character.desire} onChange={v => onChange({ desire: v })} />
      </div>
    </div>
  );
}
