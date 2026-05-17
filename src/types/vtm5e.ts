export type DotRating = 0 | 1 | 2 | 3 | 4 | 5;
export type BoxState = 'empty' | 'superficial' | 'aggravated';

export const CLANS = [
  'Banu Haqim', 'Brujah', 'Gangrel', 'Hecata', 'Lasombra',
  'Malkavian', 'Ministry', 'Nosferatu', 'Ravnos', 'Salubri',
  'Toreador', 'Tremere', 'Tzimisce', 'Ventrue', 'Caitiff', 'Thin-Blood',
] as const;
export type Clan = (typeof CLANS)[number] | '';

export const PREDATOR_TYPES = [
  'Alleycat', 'Bagger', 'Blood Leech', 'Cleaver', 'Consensualist',
  'Farmer', 'Graverobber', 'Osiris', 'Scene Queen', 'Siren',
] as const;

export const ALL_DISCIPLINES = [
  'Animalism', 'Auspex', 'Blood Sorcery', 'Celerity', 'Dominate',
  'Fortitude', 'Obfuscate', 'Oblivion', 'Potence', 'Presence',
  'Protean', 'Thin-Blood Alchemy',
] as const;

export interface Attributes {
  strength: DotRating;
  dexterity: DotRating;
  stamina: DotRating;
  charisma: DotRating;
  manipulation: DotRating;
  composure: DotRating;
  intelligence: DotRating;
  wits: DotRating;
  resolve: DotRating;
}

export interface Skill {
  id: string;
  name: string;
  rating: DotRating;
  specialty: string;
}

export interface DisciplinePower {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface Discipline {
  id: string;
  name: string;
  rating: DotRating;
  powers: DisciplinePower[];
}

export interface Advantage {
  id: string;
  name: string;
  rating: DotRating;
  description: string;
}

export interface Touchstone {
  id: string;
  name: string;
  conviction: string;
}

export interface Character {
  id: string;
  name: string;
  player: string;
  chronicle: string;
  concept: string;
  ambition: string;
  desire: string;
  predatorType: string;
  clan: string;
  generation: number;
  sire: string;
  attributes: Attributes;
  physicalSkills: Skill[];
  socialSkills: Skill[];
  mentalSkills: Skill[];
  disciplines: Discipline[];
  bloodPotency: number;
  hunger: number;
  humanity: number;
  health: BoxState[];
  willpower: BoxState[];
  backgrounds: Advantage[];
  merits: Advantage[];
  flaws: Advantage[];
  tenets: string[];
  touchstones: Touchstone[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_PHYSICAL_SKILLS: Skill[] = [
  { id: 'athletics', name: 'Athletics', rating: 0, specialty: '' },
  { id: 'brawl', name: 'Brawl', rating: 0, specialty: '' },
  { id: 'craft', name: 'Craft', rating: 0, specialty: '' },
  { id: 'drive', name: 'Drive', rating: 0, specialty: '' },
  { id: 'firearms', name: 'Firearms', rating: 0, specialty: '' },
  { id: 'larceny', name: 'Larceny', rating: 0, specialty: '' },
  { id: 'melee', name: 'Melee', rating: 0, specialty: '' },
  { id: 'stealth', name: 'Stealth', rating: 0, specialty: '' },
  { id: 'survival', name: 'Survival', rating: 0, specialty: '' },
];

const DEFAULT_SOCIAL_SKILLS: Skill[] = [
  { id: 'animal-ken', name: 'Animal Ken', rating: 0, specialty: '' },
  { id: 'etiquette', name: 'Etiquette', rating: 0, specialty: '' },
  { id: 'insight', name: 'Insight', rating: 0, specialty: '' },
  { id: 'intimidation', name: 'Intimidation', rating: 0, specialty: '' },
  { id: 'leadership', name: 'Leadership', rating: 0, specialty: '' },
  { id: 'performance', name: 'Performance', rating: 0, specialty: '' },
  { id: 'persuasion', name: 'Persuasion', rating: 0, specialty: '' },
  { id: 'streetwise', name: 'Streetwise', rating: 0, specialty: '' },
  { id: 'subterfuge', name: 'Subterfuge', rating: 0, specialty: '' },
];

const DEFAULT_MENTAL_SKILLS: Skill[] = [
  { id: 'academics', name: 'Academics', rating: 0, specialty: '' },
  { id: 'awareness', name: 'Awareness', rating: 0, specialty: '' },
  { id: 'finance', name: 'Finance', rating: 0, specialty: '' },
  { id: 'investigation', name: 'Investigation', rating: 0, specialty: '' },
  { id: 'medicine', name: 'Medicine', rating: 0, specialty: '' },
  { id: 'occult', name: 'Occult', rating: 0, specialty: '' },
  { id: 'politics', name: 'Politics', rating: 0, specialty: '' },
  { id: 'science', name: 'Science', rating: 0, specialty: '' },
  { id: 'technology', name: 'Technology', rating: 0, specialty: '' },
];

export function createDefaultCharacter(id: string): Character {
  const now = new Date().toISOString();
  return {
    id,
    name: '',
    player: '',
    chronicle: '',
    concept: '',
    ambition: '',
    desire: '',
    predatorType: '',
    clan: '',
    generation: 13,
    sire: '',
    attributes: {
      strength: 1, dexterity: 1, stamina: 1,
      charisma: 1, manipulation: 1, composure: 1,
      intelligence: 1, wits: 1, resolve: 1,
    },
    physicalSkills: DEFAULT_PHYSICAL_SKILLS.map(s => ({ ...s })),
    socialSkills: DEFAULT_SOCIAL_SKILLS.map(s => ({ ...s })),
    mentalSkills: DEFAULT_MENTAL_SKILLS.map(s => ({ ...s })),
    disciplines: [],
    bloodPotency: 1,
    hunger: 1,
    humanity: 7,
    health: Array(4).fill('empty') as BoxState[],
    willpower: Array(2).fill('empty') as BoxState[],
    backgrounds: [],
    merits: [],
    flaws: [],
    tenets: ['', '', ''],
    touchstones: [{ id: crypto.randomUUID(), name: '', conviction: '' }],
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
}

export function resizeBoxes(current: BoxState[], newSize: number): BoxState[] {
  if (newSize === current.length) return current;
  if (newSize > current.length) {
    return [...current, ...Array(newSize - current.length).fill('empty')];
  }
  return current.slice(0, newSize);
}
