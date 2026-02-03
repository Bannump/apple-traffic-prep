import React, { useEffect, useRef } from 'react';

export function NotesModal({ isOpen, slotId, slotTitle, initialValue, onSave, onClose }) {
  const textareaRef = useRef(null);
  const [value, setValue] = React.useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, slotId]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(slotId, value);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal modal-open"
      aria-hidden="false"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-modal-title"
    >
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="modal-content">
        <header className="modal-header">
          <h3 id="notes-modal-title">Notes: {slotTitle}</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </header>
        <div className="modal-body">
          <textarea
            ref={textareaRef}
            id="notesInput"
            placeholder="Add notes for this slot…"
            rows={8}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <footer className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save Notes
          </button>
        </footer>
      </div>
    </div>
  );
}
