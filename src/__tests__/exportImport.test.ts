import { describe, it, expect } from 'vitest';
import { parseImportedCharacter } from '../lib/exportImport';

function makeFile(content: string, name = 'char.json'): File {
  return new File([content], name, { type: 'application/json' });
}

const validCharacter = {
  id: 'old-id',
  name: 'Dracula',
  player: 'Test',
  chronicle: '',
  concept: '',
  ambition: '',
  desire: '',
  predatorType: '',
  clan: 'Ventrue',
  generation: 13,
  sire: '',
  attributes: { strength: 1, dexterity: 1, stamina: 1, charisma: 1, manipulation: 1, composure: 1, intelligence: 1, wits: 1, resolve: 1 },
  physicalSkills: [],
  socialSkills: [],
  mentalSkills: [],
  disciplines: [],
  bloodPotency: 1,
  hunger: 1,
  humanity: 7,
  health: ['empty', 'empty', 'empty', 'empty'],
  willpower: ['empty', 'empty'],
  backgrounds: [],
  merits: [],
  flaws: [],
  tenets: ['', '', ''],
  touchstones: [],
  notes: '',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('parseImportedCharacter', () => {
  it('accepts a valid character file', async () => {
    const file = makeFile(JSON.stringify(validCharacter));
    const result = await parseImportedCharacter(file);
    expect(result.name).toBe('Dracula');
  });

  it('assigns a new id on import', async () => {
    const file = makeFile(JSON.stringify(validCharacter));
    const result = await parseImportedCharacter(file);
    expect(result.id).not.toBe('old-id');
  });

  it('updates createdAt and updatedAt timestamps', async () => {
    const file = makeFile(JSON.stringify(validCharacter));
    const result = await parseImportedCharacter(file);
    expect(result.createdAt).not.toBe('2024-01-01T00:00:00.000Z');
    expect(result.updatedAt).not.toBe('2024-01-01T00:00:00.000Z');
  });

  it('preserves character data', async () => {
    const file = makeFile(JSON.stringify(validCharacter));
    const result = await parseImportedCharacter(file);
    expect(result.clan).toBe('Ventrue');
    expect(result.humanity).toBe(7);
  });

  it('rejects invalid JSON', async () => {
    const file = makeFile('not json at all');
    await expect(parseImportedCharacter(file)).rejects.toThrow('not valid JSON');
  });

  it('rejects a JSON array', async () => {
    const file = makeFile('[1, 2, 3]');
    await expect(parseImportedCharacter(file)).rejects.toThrow('Invalid character file format');
  });

  it('rejects an object missing required fields', async () => {
    const file = makeFile(JSON.stringify({ name: 'Missing Fields' }));
    await expect(parseImportedCharacter(file)).rejects.toThrow('Night Creatures character sheet');
  });

  it('rejects null', async () => {
    const file = makeFile('null');
    await expect(parseImportedCharacter(file)).rejects.toThrow();
  });
});
