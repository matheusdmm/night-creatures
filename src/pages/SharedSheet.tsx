import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { decodeCharacter } from '../lib/share';
import CharacterSheet from '../components/CharacterSheet';
import { useCharacterStorage } from '../hooks/useCharacterStorage';
import HamburgerMenu from '../components/HamburgerMenu';
import type { Character } from '../types/vtm5e';

export default function SharedSheet() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { importCharacter } = useCharacterStorage();

  const decoded = useMemo<Character | null>(() => {
    const encoded = params.get('c');
    if (!encoded) return null;
    try {
      return decodeCharacter(encoded);
    } catch {
      return null;
    }
  }, [params]);

  const [local, setLocal] = useState<Character | null>(decoded);

  if (!local) {
    return (
      <div className="min-h-screen flex items-center justify-center text-parchment-dim font-serif italic">
        Invalid or missing share link.{' '}
        <button className="ml-2 text-blood-bright underline" onClick={() => navigate('/')}>
          Go home
        </button>
      </div>
    );
  }

  function handleImport() {
    if (!local) return;
    importCharacter(local);
    navigate(`/character/${local.id}`);
  }

  return (
    <div className="min-h-screen bg-night-bg">
      <div className="sticky top-0 z-10 bg-night-surface/95 backdrop-blur border-b border-night-border px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-parchment-dim hover:text-parchment font-cinzel text-sm tracking-wide transition-colors shrink-0"
        >
          ← <span className="hidden sm:inline">Home</span>
        </button>

        <h1 className="flex-1 min-w-0 font-cinzel text-parchment tracking-wide truncate">
          {local.name || <span className="italic">Unnamed</span>}
          <span className="ml-2 text-parchment-dim text-xs font-cinzel normal-case tracking-normal">
            (shared)
          </span>
        </h1>

        <button
          type="button"
          onClick={handleImport}
          className="font-cinzel text-xs tracking-widest uppercase px-3 py-1 rounded border transition-colors
                     border-blood text-blood-bright hover:bg-blood/20 shrink-0"
        >
          + Import
        </button>

        <HamburgerMenu />
      </div>

      <div className="bg-night-border/20 border-b border-night-border px-4 py-2 text-center">
        <p className="text-parchment-dim text-xs font-cinzel tracking-wider">
          Viewing a shared sheet — changes are local only.
          <button
            type="button"
            onClick={handleImport}
            className="ml-2 text-blood-bright hover:text-parchment underline transition-colors"
          >
            Import to save.
          </button>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <CharacterSheet character={local} onChange={updates => setLocal(prev => prev ? { ...prev, ...updates } : prev)} />
      </div>
    </div>
  );
}
