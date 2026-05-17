import type { Skill, DotRating } from '../../types/vtm5e';
import DotRating_ from '../ui/DotRating';

interface Props {
  physical: Skill[];
  social: Skill[];
  mental: Skill[];
  onChange: (category: 'physicalSkills' | 'socialSkills' | 'mentalSkills', skills: Skill[]) => void;
}

function SkillRow({
  skill,
  onChange,
}: {
  skill: Skill;
  onChange: (updated: Skill) => void;
}) {
  return (
    <div className="border-b border-night-border/50 last:border-0 py-1 space-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-parchment text-sm font-serif">{skill.name}</span>
        <DotRating_
          value={skill.rating}
          max={5}
          size="sm"
          onChange={v => onChange({ ...skill, rating: v as DotRating })}
        />
      </div>
      {skill.rating > 0 && (
        <input
          className="text-xs text-parchment-dim border-b border-night-border/30 bg-transparent w-full
                     focus:outline-none focus:border-blood placeholder:text-parchment-dim/30 italic"
          value={skill.specialty}
          onChange={e => onChange({ ...skill, specialty: e.target.value })}
          placeholder="specialty..."
        />
      )}
    </div>
  );
}

function SkillGroup({
  title,
  skills,
  category,
  onChange,
}: {
  title: string;
  skills: Skill[];
  category: 'physicalSkills' | 'socialSkills' | 'mentalSkills';
  onChange: Props['onChange'];
}) {
  function updateSkill(index: number, updated: Skill) {
    const next = [...skills];
    next[index] = updated;
    onChange(category, next);
  }

  return (
    <div>
      <h4 className="section-title">{title}</h4>
      {skills.map((skill, i) => (
        <SkillRow key={skill.id} skill={skill} onChange={updated => updateSkill(i, updated)} />
      ))}
    </div>
  );
}

export default function SkillsSection({ physical, social, mental, onChange }: Props) {
  return (
    <div className="panel">
      <h3 className="font-cinzel text-gold text-sm tracking-widest uppercase mb-4">Skills</h3>
      <div className="space-y-4">
        <SkillGroup title="Physical" skills={physical} category="physicalSkills" onChange={onChange} />
        <SkillGroup title="Social" skills={social} category="socialSkills" onChange={onChange} />
        <SkillGroup title="Mental" skills={mental} category="mentalSkills" onChange={onChange} />
      </div>
    </div>
  );
}
