import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Modal dialog displaying a question, answer reveal, and correct/incorrect marking.
 * Props: { question, points, onClose, onMarkAnswer(theme) }
 */
function QuestionModal({ question, points, onClose, onMarkAnswer, theme }) {
  const [revealed, setRevealed] = useState(false);

  if (!question) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="modal"
        style={{ border: `3px solid ${theme.primary}` }}
        tabIndex={0}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="modal-title">
          {points} points
        </span>
        <div className="modal-question">{question.question}</div>
        {revealed ? (
          <div className="modal-answer" data-testid="answer">
            {question.answer}
          </div>
        ) : (
          <button
            className="btn secondary"
            style={{ background: theme.accent, color: "#fff" }}
            onClick={() => setRevealed(true)}
          >
            Show Answer
          </button>
        )}
        {revealed && (
          <div className="modal-actions" style={{ marginTop: "0.6em" }}>
            <button
              className="btn"
              style={{ background: theme.primary }}
              onClick={() => onMarkAnswer(true)}
            >
              Correct ✅
            </button>
            <button
              className="btn warning"
              style={{ background: theme.secondary, color: "#222" }}
              onClick={() => onMarkAnswer(false)}
            >
              Incorrect ❌
            </button>
            <button
              className="btn"
              style={{
                marginLeft: "auto",
                background: theme.accent,
                color: "#fff",
              }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionModal;
