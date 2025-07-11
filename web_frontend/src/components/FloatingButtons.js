import React from "react";

/**
 * PUBLIC_INTERFACE
 * Floating action buttons for reset and file upload.
 * Props: {showReset, onReset, theme}
 *
 * Accessibility/visual improvements, comments inline.
 */
function FloatingButtons({ showReset, onReset, theme }) {
  return (
    // .fab-wrap styles positioning and stacking for FABs
    <div
      className="fab-wrap"
      aria-label="Floating actions"
      style={{
        zIndex: 4444, // above everything
        pointerEvents: "none", // disables accidental pointer events outside buttons
        bottom: 34,
        right: 32,
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.95em",
        touchAction: "none", // for better touch screen compatibility
      }}
    >
      {showReset && (
        <button
          className="fab"
          title="Reset / New Game"
          aria-label="Reset game or upload new dataset"
          type="button"
          tabIndex={0}
          // Large, visually prominent FAB for accessibility and large classroom screens
          style={{
            background: `linear-gradient(120deg, ${theme.primary} 85%, ${theme.secondary} 100%)`,
            color: "#fff",
            fontWeight: 900,
            fontSize: "2.55em",
            width: 72, // slightly larger
            height: 72,
            borderRadius: "50%",
            border: "4px solid #f7fafc",
            boxShadow: "0 4px 22px #0006",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.19s, color 0.13s, box-shadow 0.13s, transform 0.13s",
            outline: "none",
            pointerEvents: "auto",
            cursor: "pointer",
            marginBottom: "0.4em",
            marginRight: 2,
            touchAction: "manipulation"
          }}
          onClick={onReset}
          onFocus={e => (e.target.style.boxShadow = `0 0 0 5px ${theme.accent}66`)}
          onBlur={e => (e.target.style.boxShadow = "0 4px 22px #0006")}
        >
          <span
            aria-hidden="true"
            style={{
              fontSize: "1em",
              color: "#fff",
              textShadow: "0 1px 8px #136",
              padding: "0 0.05em",
              userSelect: "none"
            }}
          >
            ⟲
          </span>
        </button>
      )}
    </div>
  );
}

export default FloatingButtons;
