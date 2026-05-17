export interface ClanData {
  name: string;
  disciplines: string[];
  bane: string;
  compulsion: string;
}

export const CLAN_DATA: ClanData[] = [
  {
    name: 'Banu Haqim',
    disciplines: ['Blood Sorcery', 'Celerity', 'Obfuscate'],
    bane: 'Diablerie craving — must test not to commit diablerie after defeating a foe in combat.',
    compulsion: 'Judgement — must punish those who transgress against a personal code.',
  },
  {
    name: 'Brujah',
    disciplines: ['Celerity', 'Potence', 'Presence'],
    bane: 'Violent Temper — Frenzy test difficulty increased by 2 when provoked.',
    compulsion: 'Rebellion — must defy or undermine any perceived authority.',
  },
  {
    name: 'Gangrel',
    disciplines: ['Animalism', 'Fortitude', 'Protean'],
    bane: 'Feral Impulses — gain animal features after frenzying, 1 per frenzy, lasts one night per Bane Severity.',
    compulsion: 'Feral Impulses — must act as a predatory animal for one scene.',
  },
  {
    name: 'Hecata',
    disciplines: ['Auspex', 'Fortitude', 'Oblivion'],
    bane: 'Painful Kiss — bite deals Aggravated damage to mortals; the Kiss causes agony instead of bliss.',
    compulsion: 'Morbidity — obsessed with death; must interact with something related to death.',
  },
  {
    name: 'Lasombra',
    disciplines: ['Dominate', 'Oblivion', 'Potence'],
    bane: 'Distorted Reflection — do not appear in mirrors, cameras, or on screens.',
    compulsion: 'Ruthlessness — must succeed at a challenge or task at any cost.',
  },
  {
    name: 'Malkavian',
    disciplines: ['Auspex', 'Dominate', 'Obfuscate'],
    bane: 'Fractured Perspective — suffer from a permanent mental derangement tied to their Bane Severity.',
    compulsion: 'Delusion — must act on or spread a supernatural conviction.',
  },
  {
    name: 'Ministry',
    disciplines: ['Obfuscate', 'Presence', 'Protean'],
    bane: 'Abhors the Sacred — Bane Severity penalty to all dice pools while in the presence of faith.',
    compulsion: 'Transgression — must tempt someone into indulging in a vice.',
  },
  {
    name: 'Nosferatu',
    disciplines: ['Animalism', 'Obfuscate', 'Potence'],
    bane: 'Repulsiveness — Appearance is 0; cannot benefit from Blush of Life to appear attractive.',
    compulsion: 'Cryptophilia — must reveal or obtain a secret before ending the scene.',
  },
  {
    name: 'Ravnos',
    disciplines: ['Animalism', 'Obfuscate', 'Presence'],
    bane: 'Slumbering Beast — sleep during the day as if dead; require longer rest and are harder to wake.',
    compulsion: 'Tempting Fate — must attempt a reckless stunt or take an undue risk.',
  },
  {
    name: 'Salubri',
    disciplines: ['Auspex', 'Dominate', 'Fortitude'],
    bane: 'Hunted — other vampires may freely diablerise a Salubri without Stain.',
    compulsion: 'Affective Empathy — must aid those in pain or suffering.',
  },
  {
    name: 'Toreador',
    disciplines: ['Auspex', 'Celerity', 'Presence'],
    bane: 'Aesthetic Fixation — become entranced by beauty; test to break away.',
    compulsion: 'Obsession — become fixated on a subject of beauty, ignoring all else.',
  },
  {
    name: 'Tremere',
    disciplines: ['Auspex', 'Blood Sorcery', 'Dominate'],
    bane: 'Deficient Blood — Tremere vitae is less potent; costs more to create Blood Bonds.',
    compulsion: 'Perfectionism — cannot accept a result less than perfect on a task.',
  },
  {
    name: 'Tzimisce',
    disciplines: ['Animalism', 'Dominate', 'Protean'],
    bane: 'Bound to the Soil — must rest with a handful of native soil or suffer penalties.',
    compulsion: 'Covetousness — must claim ownership of something (or someone) in the scene.',
  },
  {
    name: 'Ventrue',
    disciplines: ['Dominate', 'Fortitude', 'Presence'],
    bane: 'Rarefied Tastes — can only feed from a narrow type of mortal; others provide no sustenance.',
    compulsion: 'Arrogance — must assert dominance or refuse to accept a subordinate role.',
  },
  {
    name: 'Caitiff',
    disciplines: [],
    bane: 'Outcast — no Clan, shunned by Kindred society; Bane Severity applies to social tests with established vampires.',
    compulsion: 'None — Caitiff have no set Compulsion but are viewed with suspicion.',
  },
  {
    name: 'Thin-Blood',
    disciplines: [],
    bane: 'Thin Blood — reduced Hunger capacity, weaker Blood Potency; many Discipline powers unavailable.',
    compulsion: 'None — Thin-Bloods have unique alchemical abilities instead.',
  },
];
