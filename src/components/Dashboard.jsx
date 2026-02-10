import React from 'react';
import { SPRINT_SCHEDULE } from '../data/schedule';

function countCompleted(dayData, completed) {
  return dayData.slots.filter((s) => completed[s.id]).length;
}

function countSlots(dayData) {
  return dayData.slots.length;
}

export function Dashboard({ completed, onSelectDay }) {
  return (
    <section className="view view-dashboard active">
      <div className="dashboard-hero">
        <h2>Sprint Overview</h2>
        <p className="dashboard-sub">7-Hour Daily Block • Track tasks & notes by day</p>
      </div>
      <div className="day-cards">
        {SPRINT_SCHEDULE.map((d) => {
          const done = countCompleted(d, completed);
          const total = countSlots(d);
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <article
              key={d.day}
              className="day-card"
              onClick={() => onSelectDay(d.day)}
              onKeyDown={(e) => e.key === 'Enter' && onSelectDay(d.day)}
              role="button"
              tabIndex={0}
            >
              <header className="day-card-header">
                <h3>Day {d.day}</h3>
                <span className="day-card-pct">{pct}%</span>
              </header>
              <p className="day-card-title">{d.title}</p>
              <div className="day-card-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="day-card-count">
                  {done} / {total} slots
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
