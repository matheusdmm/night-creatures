import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCharacterStorage } from '../hooks/useCharacterStorage';
import type { Character } from '../types/vtm5e';
import CharacterSheet from '../components/CharacterSheet';
import DiceRoller from '../components/DiceRoller';
import { validateSheet } from '../lib/api';
import type { ValidationResult } from '../lib/api';

type SaveState = 'saved' | 'saving' | 'unsaved';

export default function CharacterBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCharacter, updateCharacter } = useCharacterStorage();

  const character = id ? getCharacter(id) : undefined;
  const [local, setLocal] = useState<Character | null>(character ?? null);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showDice, setShowDice] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (character && !local) setLocal(character);
  }, [character]);

  if (!local) {
    return (
      <div className="min-h-screen flex items-center justify-center text-parchment-dim font-serif italic">
        Character not found.{' '}
        <button className="ml-2 text-blood-bright underline" onClick={() => navigate('/')}>
          Go back
        </button>
      </div>
    );
  }

  function handleChange(updates: Partial<Character>) {
    if (!local) return;
    const next = { ...local, ...updates };
    setLocal(next);
    setSaveState('saving');
    setValidation(null);

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateCharacter(next.id, next);
      setSaveState('saved');
    }, 800);
  }

  async function handleValidate() {
    if (!local) return;
    setValidating(true);
    setShowValidation(true);
    try {
      const result = await validateSheet(local);
      setValidation(result);
    } catch {
      setValidation(null);
    } finally {
      setValidating(false);
    }
  }

  const saveLabel: Record<SaveState, string> = {
    saved: '✓ Saved',
    saving: 'Saving…',
    unsaved: 'Unsaved',
  };
  const saveLabelClass: Record<SaveState, string> = {
    saved: 'text-parchment-dim',
    saving: 'text-gold',
    unsaved: 'text-blood-bright',
  };

  const validationBadge = validation
    ? validation.valid
      ? 'text-green-400'
      : 'text-blood-bright'
    : '';

  return (
    <div className="min-h-screen bg-night-bg">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 bg-night-surface/95 backdrop-blur border-b border-night-border px-4 py-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-parchment-dim hover:text-parchment font-cinzel text-sm tracking-wide transition-colors"
        >
          ← Home
        </button>

        <h1 className="flex-1 font-cinzel text-parchment tracking-wide truncate">
          {local.name || <span className="text-parchment-dim italic">Unnamed</span>}
        </h1>

        <button
          type="button"
          onClick={() => { setShowDice(v => !v); setShowValidation(false); }}
          className={`font-cinzel text-xs tracking-widest uppercase px-3 py-1 rounded border transition-colors
            ${showDice
              ? 'border-blood bg-blood/20 text-blood-bright'
              : 'border-night-borderLight text-parchment-dim hover:border-blood hover:text-blood-bright'}`}
        >
          Dice
        </button>

        <button
          type="button"
          onClick={handleValidate}
          disabled={validating}
          className={`font-cinzel text-xs tracking-widest uppercase px-3 py-1 rounded border transition-colors
            ${validationBadge || 'text-parchment-dim'}
            ${showValidation
              ? 'border-blood bg-blood/20'
              : 'border-night-borderLight hover:border-blood'}
            disabled:opacity-50`}
        >
          {validating ? 'Checking…' : 'Validate'}
        </button>

        <span className={`text-xs font-cinzel tracking-wider ${saveLabelClass[saveState]}`}>
          {saveLabel[saveState]}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Dice Roller panel */}
        {showDice && (
          <DiceRoller defaultPool={4} hunger={local.hunger} />
        )}

        {/* Validation panel */}
        {showValidation && (
          <div className="panel-dark space-y-3">
            <h3 className="font-cinzel text-gold text-sm tracking-widest uppercase">
              Sheet Validation
            </h3>

            {validating && (
              <p className="text-parchment-dim text-sm font-serif italic">Checking rules…</p>
            )}

            {validation && !validating && (
              <>
                <p className={`font-cinzel text-sm tracking-wide ${validation.valid ? 'text-green-400' : 'text-blood-bright'}`}>
                  {validation.valid
                    ? '✓ Sheet is valid'
                    : `✕ ${validation.errors.length} error${validation.errors.length > 1 ? 's' : ''} found`}
                </p>

                {validation.errors.length > 0 && (
                  <div className="space-y-1">
                    <p className="field-label">Errors</p>
                    {validation.errors.map((e, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-blood-bright shrink-0">✕</span>
                        <span className="text-parchment font-serif">{e.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {validation.warnings.length > 0 && (
                  <div className="space-y-1">
                    <p className="field-label">Warnings</p>
                    {validation.warnings.map((w, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-gold shrink-0">⚠</span>
                        <span className="text-parchment-muted font-serif">{w.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {validation.errors.length === 0 && validation.warnings.length === 0 && (
                  <p className="text-parchment-dim text-sm font-serif italic">No issues found.</p>
                )}
              </>
            )}

            {!validation && !validating && (
              <p className="text-blood-bright text-sm font-serif italic">
                Could not reach the validation server.
              </p>
            )}
          </div>
        )}

        <CharacterSheet character={local} onChange={handleChange} />
      </div>
    </div>
  );
}
