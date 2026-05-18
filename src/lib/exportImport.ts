import type { Character } from '../types/vtm5e';

export function exportCharacter(character: Character): void {
  const json = JSON.stringify(character, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${character.name || 'unnamed'}-vtm5e.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function parseImportedCharacter(file: File): Promise<Character> {
  const text = await file.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON.');
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid character file format.');
  }

  const d = data as Record<string, unknown>;
  if (!d.attributes || !d.physicalSkills || !d.socialSkills || !d.mentalSkills) {
    throw new Error('File does not appear to be a Night Creatures character sheet.');
  }

  const now = new Date().toISOString();
  return {
    ...(d as Character),
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}
