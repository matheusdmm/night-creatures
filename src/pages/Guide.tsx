import { useNavigate } from 'react-router-dom';
import { CLAN_DATA } from '../data/clans';
import { PREDATOR_TYPES } from '../types/vtm5e';

interface StepProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

function Step({ number, title, children }: StepProps) {
  return (
    <section className="panel space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="font-cinzel text-blood text-2xl font-bold w-8 shrink-0">{number}</span>
        <h2 className="font-cinzel text-parchment text-xl tracking-wide">{title}</h2>
      </div>
      <div className="pl-11 space-y-3">{children}</div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-night-surface border border-night-borderLight text-parchment-muted
                     font-cinzel text-xs tracking-wider px-2 py-0.5 rounded">
      {children}
    </span>
  );
}

function Allocation({ label, value, color = 'text-blood-bright' }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`font-cinzel text-sm font-bold ${color}`}>{value}</span>
      <span className="text-parchment-muted text-sm font-serif">{label}</span>
    </div>
  );
}

export default function Guide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-night-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-night-surface/95 backdrop-blur border-b border-night-border px-4 py-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-parchment-dim hover:text-parchment font-cinzel text-sm tracking-wide transition-colors"
        >
          ← Home
        </button>
        <h1 className="flex-1 font-cinzel text-parchment tracking-wide">
          How to Create a Character
        </h1>
        <span className="text-blood text-xs font-cinzel tracking-[0.3em] uppercase">
          VtM V5
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        {/* Intro */}
        <div className="text-center pb-4">
          <p className="font-serif italic text-parchment-muted text-lg leading-relaxed">
            Creating a vampire in Vampire: the Masquerade V5 is a process of defining
            who your character was, and what they are becoming in the darkness.
            Follow these steps in order.
          </p>
        </div>

        {/* Step 1 — Concept */}
        <Step number={1} title="Concept">
          <p className="text-parchment-muted font-serif leading-relaxed">
            Before touching numbers, define who your character <em>is</em>. A strong concept
            grounds every other choice.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="panel-dark">
              <p className="field-label mb-1">Concept</p>
              <p className="text-parchment-muted text-sm font-serif italic">
                A one-line summary — "disgraced surgeon", "corporate fixer", "street artist".
              </p>
            </div>
            <div className="panel-dark">
              <p className="field-label mb-1">Ambition</p>
              <p className="text-parchment-muted text-sm font-serif italic">
                Long-term goal that drives your character forward through unlife.
              </p>
            </div>
            <div className="panel-dark">
              <p className="field-label mb-1">Desire</p>
              <p className="text-parchment-muted text-sm font-serif italic">
                Immediate want — more personal and visceral than Ambition.
              </p>
            </div>
            <div className="panel-dark">
              <p className="field-label mb-1">Sire</p>
              <p className="text-parchment-muted text-sm font-serif italic">
                The vampire who Embraced you. Shapes your status and obligations.
              </p>
            </div>
          </div>
        </Step>

        {/* Step 2 — Clan */}
        <Step number={2} title="Choose Your Clan">
          <p className="text-parchment-muted font-serif leading-relaxed">
            Your Clan determines your starting Disciplines, your Bane (a curse passed from your bloodline),
            and your Compulsion (a hunger-triggered urge). Choose carefully — it defines your vampire's nature.
          </p>
          <div className="space-y-2">
            {CLAN_DATA.map(clan => (
              <details key={clan.name} className="panel-dark group">
                <summary className="cursor-pointer flex items-center gap-3 list-none">
                  <span className="font-cinzel text-parchment tracking-wide">{clan.name}</span>
                  {clan.disciplines.length > 0 && (
                    <span className="flex gap-1.5 flex-wrap">
                      {clan.disciplines.map(d => <Tag key={d}>{d}</Tag>)}
                    </span>
                  )}
                  <span className="ml-auto text-parchment-dim text-xs font-cinzel group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <div className="mt-3 pt-3 border-t border-night-border space-y-2 text-sm font-serif">
                  <p>
                    <span className="text-blood-bright font-cinzel text-xs tracking-wider uppercase mr-2">Bane</span>
                    <span className="text-parchment-muted">{clan.bane}</span>
                  </p>
                  <p>
                    <span className="text-gold font-cinzel text-xs tracking-wider uppercase mr-2">Compulsion</span>
                    <span className="text-parchment-muted">{clan.compulsion}</span>
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Step>

        {/* Step 3 — Generation & Predator Type */}
        <Step number={3} title="Generation & Predator Type">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="panel-dark space-y-2">
              <p className="font-cinzel text-parchment tracking-wide">Generation</p>
              <p className="text-parchment-muted text-sm font-serif leading-relaxed">
                How many steps removed from Caine you are. New vampires typically begin at
                <span className="text-blood-bright font-cinzel"> 13th Generation</span> with
                Blood Potency 1. Lower generations are more powerful but harder to justify narratively.
              </p>
            </div>
            <div className="panel-dark space-y-2">
              <p className="font-cinzel text-parchment tracking-wide">Predator Type</p>
              <p className="text-parchment-muted text-sm font-serif leading-relaxed">
                How your vampire hunts. Each type grants bonus Skills and Advantages and may
                affect your Humanity.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PREDATOR_TYPES.map(pt => <Tag key={pt}>{pt}</Tag>)}
              </div>
            </div>
          </div>
        </Step>

        {/* Step 4 — Attributes */}
        <Step number={4} title="Attributes">
          <p className="text-parchment-muted font-serif leading-relaxed">
            Attributes are split into three categories. All start at
            <span className="text-blood-bright font-cinzel"> 1</span> automatically.
            Prioritize the three categories — extra dots are added on top of the base.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Physical', skills: 'Strength · Dexterity · Stamina' },
              { label: 'Social', skills: 'Charisma · Manipulation · Composure' },
              { label: 'Mental', skills: 'Intelligence · Wits · Resolve' },
            ].map(cat => (
              <div key={cat.label} className="panel-dark text-center space-y-1">
                <p className="font-cinzel text-parchment text-sm tracking-wide">{cat.label}</p>
                <p className="text-parchment-dim text-xs font-serif">{cat.skills}</p>
              </div>
            ))}
          </div>
          <div className="panel-dark space-y-1.5">
            <p className="field-label mb-2">Extra dots to distribute by priority</p>
            <Allocation label="Primary category" value="+4 dots" />
            <Allocation label="Secondary category" value="+3 dots" color="text-gold" />
            <Allocation label="Tertiary category" value="+2 dots" color="text-parchment-muted" />
            <p className="text-parchment-dim text-xs font-serif italic pt-1">Max 5 dots in any single Attribute.</p>
          </div>
        </Step>

        {/* Step 5 — Skills */}
        <Step number={5} title="Skills">
          <p className="text-parchment-muted font-serif leading-relaxed">
            Skills also split into three categories, all starting at
            <span className="text-blood-bright font-cinzel"> 0</span>. Prioritize them independently
            from Attributes. You also get <span className="text-parchment font-cinzel">3 free Specialties</span> — pick
            a narrow focus for any skill rated 1 or higher.
          </p>
          <div className="panel-dark space-y-1.5">
            <p className="field-label mb-2">Dots to allocate per category</p>
            <Allocation label="Primary category" value="8 dots" />
            <Allocation label="Secondary category" value="6 dots" color="text-gold" />
            <Allocation label="Tertiary category" value="4 dots" color="text-parchment-muted" />
            <p className="text-parchment-dim text-xs font-serif italic pt-1">Max 3 dots in any Skill at character creation.</p>
          </div>
        </Step>

        {/* Step 6 — Disciplines */}
        <Step number={6} title="Disciplines">
          <p className="text-parchment-muted font-serif leading-relaxed">
            Disciplines are supernatural powers tied to your Clan. At creation, you get
            <span className="text-blood-bright font-cinzel"> 3 Discipline dots</span> to distribute
            among your Clan's disciplines. Each dot must be spent on a power of that level — you must
            pick at least one power per dot spent.
          </p>
          <div className="panel-dark text-sm font-serif text-parchment-muted space-y-1.5">
            <p>Caitiff may choose freely from any non-exclusive Discipline.</p>
            <p>Thin-Bloods replace Disciplines with <span className="text-gold font-cinzel text-xs">Thin-Blood Alchemy</span> and unique resonance rules.</p>
          </div>
        </Step>

        {/* Step 7 — Advantages */}
        <Step number={7} title="Advantages">
          <p className="text-parchment-muted font-serif leading-relaxed">
            Advantages represent resources, connections, and traits outside of raw power.
            You receive <span className="text-blood-bright font-cinzel">7 dots</span> to split between
            Backgrounds and Merits. Taking Flaws gives bonus dots — up to
            <span className="text-blood-bright font-cinzel"> 5 extra dots</span> from Flaws.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="panel-dark space-y-1">
              <p className="font-cinzel text-parchment text-sm tracking-wide">Backgrounds</p>
              <p className="text-parchment-dim text-xs font-serif italic">
                Resources, Contacts, Haven, Herd, Influence, Retainers, Status…
              </p>
            </div>
            <div className="panel-dark space-y-1">
              <p className="font-cinzel text-parchment text-sm tracking-wide">Merits</p>
              <p className="text-parchment-dim text-xs font-serif italic">
                Positive traits — Ambidextrous, Eat Food, Iron Will, Unbondable…
              </p>
            </div>
            <div className="panel-dark space-y-1">
              <p className="font-cinzel text-blood text-sm tracking-wide">Flaws</p>
              <p className="text-parchment-dim text-xs font-serif italic">
                Negative traits that grant extra Advantage dots — Addiction, Dark Secret, Enemy…
              </p>
            </div>
          </div>
          <p className="text-parchment-dim text-xs font-serif italic">
            Your Predator Type may grant bonus Backgrounds or Merits on top of the 7 dots.
          </p>
        </Step>

        {/* Step 8 — Humanity & Touchstones */}
        <Step number={8} title="Humanity & Touchstones">
          <p className="text-parchment-muted font-serif leading-relaxed">
            Humanity measures how much of your mortal self remains. New vampires start at
            <span className="text-blood-bright font-cinzel"> Humanity 7</span>. It falls when
            you commit acts that violate your Tenets, and if it reaches 0 your character is lost.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="panel-dark space-y-2">
              <p className="font-cinzel text-parchment tracking-wide">Chronicle Tenets</p>
              <p className="text-parchment-muted text-sm font-serif leading-relaxed">
                Three moral rules your whole chronicle upholds. Breaking them causes Stain.
                Set these with your Storyteller — they define what acts test your Humanity.
              </p>
            </div>
            <div className="panel-dark space-y-2">
              <p className="font-cinzel text-parchment tracking-wide">Touchstones & Convictions</p>
              <p className="text-parchment-muted text-sm font-serif leading-relaxed">
                A Touchstone is a mortal whose well-being anchors you to your humanity.
                Each has a personal Conviction — a value your character will not compromise.
                Start with at least one.
              </p>
            </div>
          </div>
        </Step>

        {/* Step 9 — Final Numbers */}
        <Step number={9} title="Final Numbers">
          <p className="text-parchment-muted font-serif leading-relaxed">
            Derive your final stats from the choices above.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Health', formula: 'Stamina + 3' },
              { label: 'Willpower', formula: 'Composure + Resolve' },
              { label: 'Blood Potency', formula: 'Starts at 1' },
              { label: 'Hunger', formula: 'Starts at 1' },
            ].map(stat => (
              <div key={stat.label} className="panel-dark text-center space-y-1">
                <p className="font-cinzel text-parchment text-sm tracking-wide">{stat.label}</p>
                <p className="text-blood-bright text-xs font-cinzel">{stat.formula}</p>
              </div>
            ))}
          </div>
        </Step>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-blood hover:bg-blood-bright text-parchment font-cinzel text-sm
                       tracking-widest uppercase px-6 py-3 rounded transition-colors shadow-blood-sm"
          >
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
}
