import { useState, useEffect, useCallback } from 'react';
import type { Character } from '../types/vtm5e';
import { createDefaultCharacter } from '../types/vtm5e';

const STORAGE_KEY = 'night-creatures-v1';

function loadFromStorage(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(characters: Character[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

export function useCharacterStorage() {
  const [characters, setCharacters] = useState<Character[]>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(characters);
  }, [characters]);

  const createCharacter = useCallback((): Character => {
    const character = createDefaultCharacter(crypto.randomUUID());
    setCharacters(prev => [character, ...prev]);
    return character;
  }, []);

  const updateCharacter = useCallback((id: string, updates: Partial<Character>) => {
    setCharacters(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c
      )
    );
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  }, []);

  const getCharacter = useCallback(
    (id: string): Character | undefined => characters.find(c => c.id === id),
    [characters]
  );

  return { characters, createCharacter, updateCharacter, deleteCharacter, getCharacter };
}
