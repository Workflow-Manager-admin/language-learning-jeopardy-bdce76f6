import React from "react";

/**
 * PUBLIC_INTERFACE
 * Floating action buttons for reset and file upload.
 * Props: {showReset, onReset, theme}
 */
function FloatingButtons({ showReset, onReset, theme }) {
  return (
    <div className="fab-wrap" aria-label="Floating actions">
      {showReset && (
        <button
          className="fab"
          title="Reset / New Game"
          aria-label="Reset game or upload new dataset"
          style={{ background: theme.primary, color: "#fff" }}
          onClick={onReset}
        >
          <span aria-hidden="true" style={{ fontSize: "1.1em" }}>⟲</span>
        </button>
      )}
    </div>
  );
}

export default FloatingButtons;
