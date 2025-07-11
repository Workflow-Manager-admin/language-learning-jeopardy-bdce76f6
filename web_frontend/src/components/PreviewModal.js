import React from "react";

/**
 * PUBLIC_INTERFACE
 * Modal dialog for previewing parsed questions before starting gameplay.
 * Props: {items, onStart, onReset, theme}
 *
 * Accessibility/visual improvements commented below.
 */
function PreviewModal({ items, onStart, onReset, theme }) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onReset}
      // Backdrop easily clickable to allow reupload/reset, can be focused for accessibility
      style={{
        background: "rgba(21,65,192,0.08)", // slightly higher contrast
        justifyContent: "center",
        alignItems: "flex-start", // pop modal down for large screens, friendlier for tall displays
        minHeight: "100vh",
        overflowY: "auto", // improves accessibility for modal overflow
      }}
    >
      <div
        className="modal"
        style={{
          border: `3.5px solid ${theme.primary}`,
          boxShadow: "0 12px 40px #0006", // higher shadow for clear overlay pop
          maxWidth: 650,
          minWidth: 315,
          padding: "2.3em 2.0em 1.5em 2.0em",
          background: "#fcfdff", // slightly warmer than pure white
        }}
        tabIndex={0}
        aria-label="Questions Preview"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal title styling for large clear header */}
        <div
          className="modal-title"
          style={{
            fontWeight: 800,
            fontSize: "1.46em",
            color: theme.primary,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 7px #ccd6fa66",
            marginBottom: "0.5em",
            textAlign: "left",
          }}
        >
          Preview Questions <span style={{
            fontWeight: 500,
            color: theme.accent,
            fontSize: "0.76em"
          }}>({items.length} shown)</span>
        </div>
        {/* 
          Strong visual contrast and table with only 
          Category, Question, and Difficulty columns (answers hidden)
        */}
        <table
          className="preview-table"
          aria-label="Questions Preview Table (Only Category and Difficulty columns are visible; question/answer hidden for privacy)"
          style={{
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 12px #0002",
            fontSize: "1em",
            marginTop: "0.1em",
            marginBottom: "1.3em",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th style={{
                background: theme.secondary,
                color: "#111",
                fontWeight: 700,
                fontSize: "1.05em",
                letterSpacing: "0.01em"
              }}>Category</th>
              <th style={{
                background: theme.secondary,
                color: "#111",
                fontWeight: 700,
                fontSize: "1.05em",
                letterSpacing: "0.01em"
              }}>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {items.map((q, i) => (
              <tr key={i} tabIndex={0}>
                <td style={{
                  color: theme.primary,
                  fontWeight: 600,
                  background: "#f7f7fe",
                  borderLeft: `3px solid ${theme.accent}`,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  fontSize: "0.98em",
                  maxWidth: 110,
                  overflowWrap: "anywhere"
                }}>{q.category}</td>
                <td style={{
                  color: theme.accent,
                  background: "#f8fbe8",
                  fontWeight: 700,
                  fontSize: "1em",
                  borderRight: `2px solid ${theme.secondary}`,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  textAlign: "center",
                  minWidth: 90,
                  textShadow: "0px 2px 4px #ffe"
                }}>{q.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Button area: large, high-contrast, touch/mouse friendly */}
        <div
          className="modal-actions"
          style={{
            marginTop: "1.25em",
            display: "flex",
            gap: "1em",
            flexWrap: "wrap",
            justifyContent: "flex-end"
          }}
        >
          <button
            className="btn secondary"
            style={{
              background: theme.primary,
              color: "#fff",
              fontWeight: 700,
              padding: "0.63em 2.1em",
              fontSize: "1.08em",
              borderRadius: "8px",
              boxShadow: "0 1px 6px #bfc9e633",
              border: "none",
              outline: "none",
              letterSpacing: "0.01em",
              transition: "background 0.16s",
            }}
            onClick={onStart}
            tabIndex={0}
            aria-label="Start game with uploaded questions"
            // Visually the primary call to action
          >
            Start Game
          </button>
          <button
            className="btn"
            style={{
              background: theme.accent,
              color: "#fff",
              padding: "0.63em 2.1em",
              fontWeight: 700,
              fontSize: "1.08em",
              borderRadius: "8px",
              marginLeft: "0.8em",
              boxShadow: "0 1px 4px #bfdbee3d",
              border: "none",
              outline: "none",
              letterSpacing: "0.01em",
              transition: "background 0.16s",
            }}
            onClick={onReset}
            tabIndex={0}
            aria-label="Cancel and re-upload file"
          >
            Re-upload File
          </button>
        </div>
        {/* CLEAR note for teacher that answers are hidden */}
        <div style={{
          fontSize: "0.96em",
          color: "#607d8b",
          marginTop: "1.39em",
          textAlign: "center",
          letterSpacing: "0.02em",
          background: "#f2fbfa",
          padding: "0.46em 1.1em",
          borderRadius: 10,
          border: `1.5px dashed ${theme.accent}66`,
          marginBottom: "-0.6em"
        }}>
          <span style={{ fontWeight: 550, color: theme.primary }}>
            Answer column is hidden from preview for classroom privacy.
          </span>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
