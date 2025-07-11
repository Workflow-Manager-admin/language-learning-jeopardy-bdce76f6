import React from "react";

/**
 * PUBLIC_INTERFACE
 * Modal dialog for previewing parsed questions before starting gameplay.
 * Props: {items, onStart, onReset, theme}
 */
function PreviewModal({ items, onStart, onReset, theme }) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onReset}
    >
      <div
        className="modal"
        style={{ border: `3px solid ${theme.primary}` }}
        tabIndex={0}
        onClick={(e) => e.stopPropagation()}
        aria-label="Preview"
      >
        <div className="modal-title">
          Preview Questions ({items.length} shown)
        </div>
        <table className="preview-table" aria-label="Questions Preview Table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {items.map((q, i) => (
              <tr key={i}>
                <td>{q.category}</td>
                <td>{q.difficulty}</td>
                <td>{q.question}</td>
                <td>{q.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-actions">
          <button
            className="btn secondary"
            style={{
              background: theme.primary,
              color: "#fff",
              fontWeight: 600,
            }}
            onClick={onStart}
          >
            Start Game
          </button>
          <button
            className="btn"
            style={{ background: theme.accent }}
            onClick={onReset}
          >
            Re-upload File
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
