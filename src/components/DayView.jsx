import React from 'react';
import { SPRINT_SCHEDULE } from '../data/schedule';
import { Slot } from './Slot';

function countCompleted(dayData, completed) {
  return dayData.slots.filter((s) => completed[s.id]).length;
}

function countSlots(dayData) {
  return dayData.slots.length;
}

export function DayView({ dayData, completed, getNotes, onToggleCompleted, onOpenNotes }) {
  if (!dayData) return null;

  const done = countCompleted(dayData, completed);
  const total = countSlots(dayData);
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="view view-day active">
      <div className="day-header">
        <h2 className="day-title">
          Day {dayData.day}: {dayData.title}
        </h2>
        <p className="day-focus">{dayData.focus}</p>
        <div className="day-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-value">{pct}%</span>
        </div>
      </div>
      <div className="slots">
        {dayData.slots.map((slot) => (
          <Slot
            key={slot.id}
            slot={slot}
            completed={completed[slot.id]}
            hasNotes={!!(getNotes(slot.id) || '').trim()}
            onToggleCompleted={onToggleCompleted}
            onOpenNotes={onOpenNotes}
          />
        ))}
      </div>
    </section>
  );
}
