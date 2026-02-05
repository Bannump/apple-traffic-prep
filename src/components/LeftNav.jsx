import React from 'react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'day', label: 'Day View' },
  { id: 'study', label: 'UDP Deep Dive' },
  { id: 'technical-guide', label: 'Technical Guide' },
  { id: 'interview-process', label: 'Expected Interview Process' },
  { id: 'amagi-experience', label: 'Amagi Experience' },
  { id: 'insights-qa', label: 'Insights/Q&As' },
];

export function LeftNav({ view, setView }) {
  return (
    <nav className="left-nav" aria-label="Main navigation">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`left-nav-item${view === tab.id ? ' active' : ''}`}
          onClick={() => setView(tab.id)}
          aria-pressed={view === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
