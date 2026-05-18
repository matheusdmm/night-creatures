import LZString from 'lz-string';
import type { Character } from '../types/vtm5e';

export function encodeCharacter(character: Character): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(character));
}

export function decodeCharacter(encoded: string): Character {
  const json = LZString.decompressFromEncodedURIComponent(encoded);
  if (!json) throw new Error('Failed to decompress share data.');
  const data: unknown = JSON.parse(json);
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error('Invalid share data.');
  return data as Character;
}
