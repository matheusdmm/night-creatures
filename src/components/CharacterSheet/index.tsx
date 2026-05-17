import type { Character } from '../../types/vtm5e';
import { resizeBoxes } from '../../types/vtm5e';
import { CLAN_DATA } from '../../data/clans';
import CharacterHeader from './CharacterHeader';
import AttributesSection from './AttributesSection';
import SkillsSection from './SkillsSection';
import DisciplinesSection from './DisciplinesSection';
import TrackersSection from './TrackersSection';
import AdvantagesSection from './AdvantagesSection';
import ChronicleSection from './ChronicleSection';

interface Props {
  character: Character;
  onChange: (updates: Partial<Character>) => void;
}

export default function CharacterSheet({ character, onChange }: Props) {
  const clanData = CLAN_DATA.find(c => c.name === character.clan);
  const clanDisciplines = clanData?.disciplines ?? [];

  function handleChange(updates: Partial<Character>) {
    const merged = { ...character, ...updates };

    // Auto-resize health and willpower when relevant attributes change
    if (updates.attributes) {
      const { stamina, composure, resolve } = updates.attributes;
      const healthSize = stamina + 3;
      const willpowerSize = composure + resolve;
      merged.health = resizeBoxes(merged.health, healthSize);
      merged.willpower = resizeBoxes(merged.willpower, willpowerSize);
    }

    onChange(merged);
  }

  return (
    <div className="space-y-4 pb-16">
      <CharacterHeader character={character} onChange={handleChange} />

      {/* Clan info banner */}
      {clanData && (
        <div className="panel-dark border-blood/30 text-xs text-parchment-dim space-y-1">
          <p>
            <span className="text-blood-bright font-cinzel">Bane:</span> {clanData.bane}
          </p>
          <p>
            <span className="text-blood-bright font-cinzel">Compulsion:</span> {clanData.compulsion}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AttributesSection
          attributes={character.attributes}
          onChange={attrs => handleChange({ attributes: attrs })}
        />
        <SkillsSection
          physical={character.physicalSkills}
          social={character.socialSkills}
          mental={character.mentalSkills}
          onChange={(cat, skills) => handleChange({ [cat]: skills })}
        />
        <DisciplinesSection
          disciplines={character.disciplines}
          clanDisciplines={clanDisciplines}
          onChange={disciplines => handleChange({ disciplines })}
        />
      </div>

      <TrackersSection character={character} onChange={handleChange} />

      <AdvantagesSection
        backgrounds={character.backgrounds}
        merits={character.merits}
        flaws={character.flaws}
        onChange={(cat, items) => handleChange({ [cat]: items })}
      />

      <ChronicleSection
        tenets={character.tenets}
        touchstones={character.touchstones}
        notes={character.notes}
        onChange={handleChange}
      />
    </div>
  );
}
