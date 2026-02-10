import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'apple-traffic-sprint-state';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completed: parsed.completed || {},
        notes: parsed.notes || {},
      };
    }
  } catch (_) {}
  return { completed: {}, notes: {} };
}

function saveToStorage(completed, notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed, notes }));
  } catch (_) {}
}

export function useSprintState() {
  const [completed, setCompleted] = useState({});
  const [notes, setNotesState] = useState({});

  useEffect(() => {
    const { completed: c, notes: n } = loadFromStorage();
    setCompleted(c);
    setNotesState(n);
  }, []);

  useEffect(() => {
    saveToStorage(completed, notes);
  }, [completed, notes]);

  const toggleCompleted = useCallback((slotId) => {
    setCompleted((prev) => ({
      ...prev,
      [slotId]: !prev[slotId],
    }));
  }, []);

  const setNotes = useCallback((slotId, text) => {
    setNotesState((prev) => ({ ...prev, [slotId]: text }));
  }, []);

  const getNotes = useCallback(
    (slotId) => notes[slotId] || '',
    [notes]
  );

  return { completed, notes, toggleCompleted, setNotes, getNotes };
}
