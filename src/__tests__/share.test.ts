import { describe, it, expect } from 'vitest';
import { encodeCharacter, decodeCharacter } from '../lib/share';
import { createDefaultCharacter } from '../types/vtm5e';

describe('share encode/decode', () => {
  it('round-trips a character without data loss', () => {
    const original = createDefaultCharacter('test-id');
    original.name = 'Vladislav';
    original.clan = 'Nosferatu';
    original.humanity = 5;

    const encoded = encodeCharacter(original);
    const decoded = decodeCharacter(encoded);

    expect(decoded.name).toBe('Vladislav');
    expect(decoded.clan).toBe('Nosferatu');
    expect(decoded.humanity).toBe(5);
    expect(decoded.attributes).toEqual(original.attributes);
  });

  it('encoded value survives a URLSearchParams round-trip', () => {
    const c = createDefaultCharacter('x');
    const encoded = encodeCharacter(c);
    const params = new URLSearchParams({ c: encoded });
    const recovered = params.get('c')!;
    // URLSearchParams encodes/decodes correctly; decompression should still work
    expect(() => decodeCharacter(recovered)).not.toThrow();
    expect(decodeCharacter(recovered).id).toBe(c.id);
  });

  it('encoded output is shorter than raw JSON', () => {
    const c = createDefaultCharacter('x');
    c.notes = 'A'.repeat(500);
    const raw = JSON.stringify(c).length;
    const encoded = encodeCharacter(c).length;
    expect(encoded).toBeLessThan(raw);
  });

  it('throws on garbage input', () => {
    expect(() => decodeCharacter('notvalidatall')).toThrow();
  });

  it('throws on empty string', () => {
    expect(() => decodeCharacter('')).toThrow();
  });
});
