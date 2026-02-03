import React, { useState, useCallback } from 'react';
import { SPRINT_SCHEDULE } from './data/schedule';
import { useSprintState } from './hooks/useSprintState';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DayView } from './components/DayView';
import { StudyPage } from './components/StudyPage';
import { NotesModal } from './components/NotesModal';

export default function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'day' | 'study'
  const [currentDay, setCurrentDay] = useState(1);
  const [notesModal, setNotesModal] = useState({
    open: false,
    slotId: null,
    slotTitle: '',
  });

  const { completed, toggleCompleted, setNotes, getNotes } = useSprintState();

  const dayData = SPRINT_SCHEDULE.find((d) => d.day === currentDay);

  const handleSelectDay = useCallback((day) => {
    setCurrentDay(day);
    setView('day');
  }, []);

  const handleOpenNotes = useCallback((slotId, slotTitle) => {
    setNotesModal({ open: true, slotId, slotTitle });
  }, []);

  const handleCloseNotes = useCallback(() => {
    setNotesModal((prev) => ({ ...prev, open: false }));
  }, []);

  const handleSaveNotes = useCallback((slotId, text) => {
    setNotes(slotId, text);
  }, [setNotes]);

  return (
    <div className="app">
      <Sidebar
        currentDay={currentDay}
        onSelectDay={handleSelectDay}
        completed={completed}
      />
      <main className="main">
        <h1 className="page-heading">Apple Software Engineer (ASE) Traffic Preparation</h1>
        <header className="main-header">
          <button
            type="button"
            className={`view-toggle${view === 'dashboard' ? ' active' : ''}`}
            onClick={() => setView('dashboard')}
            aria-pressed={view === 'dashboard'}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`view-toggle${view === 'day' ? ' active' : ''}`}
            onClick={() => setView('day')}
            aria-pressed={view === 'day'}
          >
            Day View
          </button>
          <button
            type="button"
            className={`view-toggle${view === 'study' ? ' active' : ''}`}
            onClick={() => setView('study')}
            aria-pressed={view === 'study'}
          >
            UDP Project Deep Dive
          </button>
        </header>

        {view === 'dashboard' && (
          <Dashboard completed={completed} onSelectDay={handleSelectDay} />
        )}
        {view === 'day' && (
          <DayView
            dayData={dayData}
            completed={completed}
            getNotes={getNotes}
            onToggleCompleted={toggleCompleted}
            onOpenNotes={handleOpenNotes}
          />
        )}
        {view === 'study' && <StudyPage />}
      </main>

      <NotesModal
        isOpen={notesModal.open}
        slotId={notesModal.slotId}
        slotTitle={notesModal.slotTitle}
        initialValue={notesModal.slotId ? getNotes(notesModal.slotId) : ''}
        onSave={handleSaveNotes}
        onClose={handleCloseNotes}
      />
    </div>
  );
}
