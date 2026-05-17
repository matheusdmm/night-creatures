import type { Character } from '../types/vtm5e';

const BASE = import.meta.env.VITE_API_URL ?? '';

export type ResultType =
  | 'critical_win'
  | 'messy_critical'
  | 'success'
  | 'failure'
  | 'bestial_failure';

export interface RollResult {
  regular_dice: number[];
  hunger_dice: number[];
  successes: number;
  result_type: ResultType;
  difficulty_met: boolean;
  margin: number;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export async function rollDice(
  pool: number,
  hunger: number,
  difficulty: number
): Promise<RollResult> {
  const res = await fetch(`${BASE}/api/roll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pool, hunger, difficulty }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function validateSheet(character: Character): Promise<ValidationResult> {
  const res = await fetch(`${BASE}/api/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(character),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
