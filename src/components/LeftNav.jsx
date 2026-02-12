import React from 'react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'day', label: 'Day View' },
  { id: 'study', label: 'UDP Deep Dive' },
  { id: 'technical-guide', label: 'Technical Guide' },
  { id: 'interview-process', label: 'Expected Interview Process' },
  { id: 'amagi-experience', label: 'Amagi Experience' },
  { id: 'insights-qa', label: 'Insights/Q&As' },
  { id: 'gpu-image-processing', label: 'GPU Image Processing' },
  { id: 'round2Prep', label: 'Round 2 Prep' },
];

export function LeftNav({ view, setView, collapsed, onToggleCollapse }) {
  return (
    <nav
      className={`left-nav${collapsed ? ' left-nav--collapsed' : ''}`}
      aria-label="Main navigation"
    >
      <button
        type="button"
        className="left-nav-toggle"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand side panel' : 'Collapse side panel'}
        title={collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        <span className="left-nav-toggle-icon" aria-hidden="true">
          {collapsed ? '›' : '‹'}
        </span>
      </button>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`left-nav-item${view === tab.id ? ' active' : ''}`}
          onClick={() => setView(tab.id)}
          aria-pressed={view === tab.id}
          title={collapsed ? tab.label : undefined}
        >
          {collapsed ? <span className="left-nav-item-short">{tab.label.charAt(0)}</span> : tab.label}
        </button>
      ))}
    </nav>
  );
}
