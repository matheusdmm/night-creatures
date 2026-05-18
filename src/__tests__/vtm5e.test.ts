import { describe, it, expect } from 'vitest';
import { createDefaultCharacter, resizeBoxes } from '../types/vtm5e';
import type { BoxState } from '../types/vtm5e';

describe('createDefaultCharacter', () => {
  it('sets all attributes to 1', () => {
    const c = createDefaultCharacter('test-id');
    const attrs = Object.values(c.attributes);
    expect(attrs).toHaveLength(9);
    expect(attrs.every(v => v === 1)).toBe(true);
  });

  it('starts with generation 13 and hunger 1', () => {
    const c = createDefaultCharacter('test-id');
    expect(c.generation).toBe(13);
    expect(c.hunger).toBe(1);
  });

  it('health has 4 boxes (stamina 1 + 3)', () => {
    const c = createDefaultCharacter('test-id');
    expect(c.health).toHaveLength(4);
    expect(c.health.every(b => b === 'empty')).toBe(true);
  });

  it('willpower has 2 boxes (composure 1 + resolve 1)', () => {
    const c = createDefaultCharacter('test-id');
    expect(c.willpower).toHaveLength(2);
  });

  it('starts with exactly 27 skills across three categories', () => {
    const c = createDefaultCharacter('test-id');
    const total = c.physicalSkills.length + c.socialSkills.length + c.mentalSkills.length;
    expect(total).toBe(27);
  });

  it('all skills start at rating 0', () => {
    const c = createDefaultCharacter('test-id');
    const all = [...c.physicalSkills, ...c.socialSkills, ...c.mentalSkills];
    expect(all.every(s => s.rating === 0)).toBe(true);
  });

  it('uses the provided id', () => {
    const c = createDefaultCharacter('my-uuid');
    expect(c.id).toBe('my-uuid');
  });

  it('starts with three empty tenets', () => {
    const c = createDefaultCharacter('x');
    expect(c.tenets).toEqual(['', '', '']);
  });

  it('starts with humanity 7', () => {
    const c = createDefaultCharacter('x');
    expect(c.humanity).toBe(7);
  });
});

describe('resizeBoxes', () => {
  const boxes: BoxState[] = ['empty', 'superficial', 'aggravated'];

  it('returns the same array when size is unchanged', () => {
    expect(resizeBoxes(boxes, 3)).toBe(boxes);
  });

  it('appends empty boxes when growing', () => {
    const result = resizeBoxes(boxes, 5);
    expect(result).toHaveLength(5);
    expect(result[3]).toBe('empty');
    expect(result[4]).toBe('empty');
  });

  it('preserves existing states when growing', () => {
    const result = resizeBoxes(boxes, 5);
    expect(result.slice(0, 3)).toEqual(boxes);
  });

  it('truncates from the right when shrinking', () => {
    const result = resizeBoxes(boxes, 2);
    expect(result).toEqual(['empty', 'superficial']);
  });

  it('handles shrink to zero', () => {
    expect(resizeBoxes(boxes, 0)).toEqual([]);
  });

  it('handles grow from empty', () => {
    const result = resizeBoxes([], 3);
    expect(result).toEqual(['empty', 'empty', 'empty']);
  });
});
