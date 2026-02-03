import React from 'react';

export function Slot({ slot, completed, hasNotes, onToggleCompleted, onOpenNotes }) {
  const typeClass = slot.type === 'break' ? 'slot-break' : 'slot-session';

  return (
    <div className={`slot ${typeClass}`} data-slot-id={slot.id}>
      <div className="slot-header">
        <span className="slot-time">{slot.time}</span>
        <label className="slot-check-wrap">
          <input
            type="checkbox"
            className="slot-check"
            checked={!!completed}
            onChange={() => onToggleCompleted(slot.id)}
            aria-label="Mark complete"
          />
          <span className="slot-check-label">Done</span>
        </label>
      </div>
      <h4 className="slot-title">{slot.title}</h4>
      {slot.bullets && slot.bullets.length > 0 && (
        <ul className="slot-bullets">
          {slot.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      <div className="slot-actions">
        <button
          type="button"
          className="btn btn-notes"
          onClick={() => onOpenNotes(slot.id, slot.title)}
          title="Notes"
        >
          {hasNotes ? 'Edit notes ✓' : 'Add notes'}
        </button>
      </div>
    </div>
  );
}
