import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStorage } from '../hooks/useCharacterStorage';
import type { Character } from '../types/vtm5e';
import { exportCharacter, parseImportedCharacter } from '../lib/exportImport';
import HamburgerMenu from '../components/HamburgerMenu';

function CharacterCard({
  character,
  onDelete,
  onExport,
}: {
  character: Character;
  onDelete: () => void;
  onExport: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div
      className="panel border-night-borderLight hover:border-blood/50 transition-colors cursor-pointer
                 group relative"
      onClick={() => navigate(`/character/${character.id}`)}
    >
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onExport();
        }}
        className="absolute top-3 right-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-parchment-dim hover:text-parchment
                   text-xs transition-opacity"
        aria-label="Export character"
        title="Export as JSON"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          if (confirm(`Delete "${character.name || 'Unnamed'}"?`)) onDelete();
        }}
        className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-blood hover:text-blood-vivid
                   text-xs transition-opacity"
        aria-label="Delete character"
      >
        ✕
      </button>

      <h2 className="font-cinzel text-parchment text-lg tracking-wide truncate pr-6">
        {character.name || <span className="text-parchment-dim italic">Unnamed</span>}
      </h2>

      <p className="text-blood-bright font-cinzel text-xs tracking-widest uppercase mt-0.5">
        {[character.clan, character.predatorType].filter(Boolean).join(' · ') || 'No clan set'}
      </p>

      {character.concept && (
        <p className="text-parchment-muted text-sm font-serif italic mt-2 line-clamp-2">
          {character.concept}
        </p>
      )}

      <div className="flex gap-4 mt-3 text-xs text-parchment-dim font-cinzel tracking-wider">
        <span>
          <span className="text-blood-bright">BP</span> {character.bloodPotency}
        </span>
        <span>
          <span className="text-gold">HUM</span> {character.humanity}
        </span>
        <span>
          <span className="text-blood-bright">GEN</span> {character.generation}th
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { characters, createCharacter, deleteCharacter, importCharacter } = useCharacterStorage();
  const importInputRef = useRef<HTMLInputElement>(null);

  function handleNew() {
    const c = createCharacter();
    navigate(`/character/${c.id}`);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const character = await parseImportedCharacter(file);
      importCharacter(character);
      navigate(`/character/${character.id}`);
    } catch (err) {
      alert(`Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return (
    <div className="min-h-screen bg-night-bg page-shadow">
      {/* Hero */}
      <header className="text-center py-16 px-4 border-b border-night-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,0,0,0.15)_0%,_transparent_70%)] pointer-events-none" />
        <p className="text-blood text-xs font-cinzel tracking-[0.4em] uppercase mb-3">
          Vampire: The Masquerade V5
        </p>
        <h1 className="font-cinzel font-bold text-4xl sm:text-5xl md:text-7xl text-parchment tracking-wider mb-3">
          Night Creatures
        </h1>
        <p className="font-serif italic text-parchment-muted text-lg">
          Character Sheet Builder
        </p>
        <div className="flex items-center justify-center gap-3 mt-6 select-none" aria-hidden>
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-blood/40" />
          <span className="font-cinzel text-blood/40 text-xs tracking-[0.4em]">✦ · ✦</span>
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-blood/40" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="font-cinzel text-parchment-muted text-sm tracking-[0.2em] uppercase">
            {characters.length === 0 ? 'No characters' : `${characters.length} character${characters.length > 1 ? 's' : ''}`}
          </h2>
          <div className="flex items-center gap-2">
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="border border-night-borderLight hover:border-blood text-parchment-dim hover:text-parchment
                         font-cinzel text-xs sm:text-sm tracking-widest uppercase px-3 sm:px-5 py-2 rounded transition-colors"
            >
              Import
            </button>
            <button
              type="button"
              onClick={handleNew}
              className="bg-blood hover:bg-blood-bright text-[#e8dcc8] font-cinzel text-xs sm:text-sm
                         tracking-widest uppercase px-3 sm:px-5 py-2 rounded transition-colors shadow-blood-sm"
            >
              <span className="hidden sm:inline">+ New Character</span>
              <span className="sm:hidden">+ New</span>
            </button>
            <HamburgerMenu />
          </div>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-20 text-parchment-dim font-serif italic">
            <p className="text-2xl mb-3">The night is empty...</p>
            <p className="text-sm">Create your first vampire to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map(c => (
              <CharacterCard
                key={c.id}
                character={c}
                onDelete={() => deleteCharacter(c.id)}
                onExport={() => exportCharacter(c)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
