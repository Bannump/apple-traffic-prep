import React, { useState, useCallback } from 'react';
import { SPRINT_SCHEDULE } from './data/schedule';
import { useSprintState } from './hooks/useSprintState';
import { ScheduleTopBar } from './components/ScheduleTopBar';
import { LeftNav } from './components/LeftNav';
import { Dashboard } from './components/Dashboard';
import { DayView } from './components/DayView';
import { StudyPage } from './components/StudyPage';
import { TechnicalGuidePage } from './components/TechnicalGuidePage';
import { InterviewProcessPage } from './components/InterviewProcessPage';
import { AmagiExperiencePage } from './components/AmagiExperiencePage';
import { InsightsQAPage } from './components/InsightsQAPage';
import { GpuImageProcessingPage } from './components/GpuImageProcessingPage';
import { NotesModal } from './components/NotesModal';

export default function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'day' | 'study' | 'technical-guide' | 'interview-process' | 'amagi-experience' | 'insights-qa' | 'gpu-image-processing'
  const [sidePanelCollapsed, setSidePanelCollapsed] = useState(false);
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
      <ScheduleTopBar
        view={view}
        currentDay={currentDay}
        onSelectDay={handleSelectDay}
        completed={completed}
      />
      <div className={`app-body${sidePanelCollapsed ? ' app-body--sidebar-collapsed' : ''}`}>
        <LeftNav
          view={view}
          setView={setView}
          collapsed={sidePanelCollapsed}
          onToggleCollapse={() => setSidePanelCollapsed((c) => !c)}
        />
        <main className="main">
          <div className="main-inner">
            <div className="main-content">
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
            {view === 'technical-guide' && <TechnicalGuidePage />}
            {view === 'interview-process' && <InterviewProcessPage />}
            {view === 'amagi-experience' && <AmagiExperiencePage />}
            {view === 'insights-qa' && <InsightsQAPage />}
            {view === 'gpu-image-processing' && <GpuImageProcessingPage />}
            </div>
          </div>
        </main>
      </div>

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
