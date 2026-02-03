import React from 'react';
import { SPRINT_SCHEDULE } from '../data/schedule';

function countCompleted(dayData, completed) {
  return dayData.slots.filter((s) => completed[s.id]).length;
}

function countSlots(dayData) {
  return dayData.slots.length;
}

function getOverallStats(schedule, completed) {
  let total = 0;
  let done = 0;
  schedule.forEach((d) => {
    d.slots.forEach((s) => {
      total += 1;
      if (completed[s.id]) done += 1;
    });
  });
  return { total, done };
}

export function Sidebar({ currentDay, onSelectDay, completed }) {
  const overall = getOverallStats(SPRINT_SCHEDULE, completed);
  const overallPct = overall.total ? Math.round((overall.done / overall.total) * 100) : 0;

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <p className="logo-sub">3-Day Sprint</p>
      </header>
      <nav className="day-nav">
        {SPRINT_SCHEDULE.map((d) => {
          const done = countCompleted(d, completed);
          const total = countSlots(d);
          const pct = total ? Math.round((done / total) * 100) : 0;
          const isActive = currentDay === d.day;
          return (
            <button
              key={d.day}
              type="button"
              className={`day-nav-item${isActive ? ' active' : ''}`}
              onClick={() => onSelectDay(d.day)}
              aria-pressed={isActive}
            >
              <span className="day-nav-num">Day {d.day}</span>
              <span className="day-nav-pct">{pct}%</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="overall-progress">
          <span className="progress-label">Overall</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <span className="progress-value">{overallPct}%</span>
        </div>
      </div>
    </aside>
  );
}
