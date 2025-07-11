import React, { useRef, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * Modal dialog for previewing parsed questions before starting gameplay.
 * Robust accessibility, centering, and responsive best practices.
 * Props: {items, onStart, onReset, theme}
 *
 * Accessibility features:
 * - Tab trapping within the modal for keyboard users (keeps focus in modal)
 * - aria-modal, role="dialog" & role="document"
 * - Focus auto-managed to modal on open/close
 * - ESC key closes the modal
 * - Modal content is always perfectly centered with robust flex CSS
 *
 * Responsiveness:
 * - Modal scales to mobile, tablet, and desktop
 * - No left-alignment ever; always centered horizontally and vertically
 */
function PreviewModal({ items, onStart, onReset, theme }) {
  // Focus management: keep modal focused for keyboard nav
  const modalRef = useRef();

  useEffect(() => {
    const lastActive = document.activeElement;
    const node = modalRef.current;
    if (node) node.focus();

    // Trap focus inside modal when open
    function handleTab(e) {
      if (e.key !== "Tab") return;
      const focusable = node.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    node && node.addEventListener("keydown", handleTab);
    return () => {
      node && node.removeEventListener("keydown", handleTab);
      if (lastActive && typeof lastActive.focus === "function") lastActive.focus();
    };
  }, []);

  // ESCAPE closes modal
  useEffect(() => {
    const escHandler = e => { if (e.key === "Escape") onReset(); };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [onReset]);

  // The modal is perfectly centered (CSS flex in App.css) in all browsers/devices.
  // All custom margins for modal centering have been removed. Only rely on robust parent Flexbox.
  return (
    <div
      className="modal-backdrop preview-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Preview uploaded questions"
      tabIndex={-1}
      onClick={onReset}
      // overlay receives click, closes modal (but stops event if dialog is clicked)
      onKeyDown={e => { if (e.key === "Tab") e.stopPropagation(); }}
    >
      {/* 
        Modal:
        - Receives focus when opened.
        - role="document" for screen readers.
        - No margin/padding overrides for centering: always let .modal-backdrop do the work.
        - Accessible, keyboard focusable, responsive sizing.
      */}
      <div
        ref={modalRef}
        className="modal preview-modal"
        tabIndex={0}
        aria-label="Questions Preview"
        role="document"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal heading */}
        <div
          className="modal-title"
          id="preview-modal-title"
          style={{
            fontWeight: 900,
            fontSize: "1.48em",
            color: theme.primary,
            letterSpacing: "-0.012em",
            textShadow: "0 2px 8px #ccd6fa80",
            marginBottom: "0.43em",
            textAlign: "left",
            lineHeight: 1.17
          }}
        >
          Preview Questions{" "}
          <span
            style={{
              fontWeight: 500,
              color: theme.accent,
              fontSize: "0.74em"
            }}
          >
            ({items.length} shown)
          </span>
        </div>
        {/* Table (category, difficulty, answers hidden) */}
        <table
          className="preview-table"
          aria-label="Questions Preview Table (Category, Difficulty; answers hidden for privacy)"
          style={{
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 14px #0001",
            fontSize: "1em",
            marginTop: "0.12em",
            marginBottom: "1.28em",
            overflow: "hidden",
            width: "100%"
          }}
        >
          <thead>
            <tr>
              <th
                scope="col"
                style={{
                  background: theme.secondary,
                  color: "#111",
                  fontWeight: 700,
                  fontSize: "1.07em",
                  letterSpacing: "0.01em",
                  borderTopLeftRadius: 8
                }}
              >
                Category
              </th>
              <th
                scope="col"
                style={{
                  background: theme.secondary,
                  color: "#111",
                  fontWeight: 700,
                  fontSize: "1.07em",
                  letterSpacing: "0.01em",
                  borderTopRightRadius: 8
                }}
              >
                Difficulty
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((q, i) => (
              <tr key={i} tabIndex={0}>
                <td
                  style={{
                    color: theme.primary,
                    fontWeight: 600,
                    background: "#f7f7fe",
                    borderLeft: `3px solid ${theme.accent}`,
                    borderTopLeftRadius: 7,
                    borderBottomLeftRadius: 11,
                    fontSize: "0.99em",
                    maxWidth: 180,
                    overflowWrap: "anywhere",
                    padding: "0.41em 0.79em"
                  }}
                >
                  {q.category}
                </td>
                <td
                  style={{
                    color: theme.accent,
                    background: "#f8fbe8",
                    fontWeight: 800,
                    fontSize: "1.01em",
                    borderRight: `2px solid ${theme.secondary}`,
                    borderTopRightRadius: 9,
                    borderBottomRightRadius: 11,
                    textAlign: "center",
                    minWidth: 80,
                    textShadow: "0px 2px 4px #ffe",
                    padding: "0.41em 0.79em"
                  }}
                >
                  {q.difficulty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal action buttons */}
        <div
          className="modal-actions"
          style={{
            marginTop: "1.10em",
            display: "flex",
            gap: "1.2em",
            flexWrap: "wrap",
            justifyContent: "flex-end"
          }}
        >
          <button
            className="btn secondary"
            style={{
              background: theme.primary,
              color: "#fff",
              fontWeight: 900,
              padding: "0.63em 2.1em",
              fontSize: "1.13em",
              borderRadius: "9px",
              boxShadow: "0 1px 7px #bfc9e656",
              border: "none",
              outline: "none",
              letterSpacing: "0.012em",
              transition: "background 0.13s"
            }}
            onClick={onStart}
            tabIndex={0}
            aria-label="Start game with uploaded questions"
            id="modal-start-btn"
          >
            Start Game
          </button>
          <button
            className="btn"
            style={{
              background: theme.accent,
              color: "#fff",
              padding: "0.63em 2.1em",
              fontWeight: 900,
              fontSize: "1.12em",
              borderRadius: "9px",
              marginLeft: "0.7em",
              boxShadow: "0 1px 6px #bfdbee44",
              border: "none",
              outline: "none",
              letterSpacing: "0.012em",
              transition: "background 0.13s"
            }}
            onClick={onReset}
            tabIndex={0}
            aria-label="Cancel and re-upload file"
            id="modal-reupload-btn"
          >
            Re-upload File
          </button>
        </div>
        {/* Accessibility: clear hidden answers note */}
        <div
          style={{
            fontSize: "0.98em",
            color: "#607d8b",
            marginTop: "1.19em",
            textAlign: "center",
            letterSpacing: "0.016em",
            background: "#f2fbfa",
            padding: "0.44em 1.10em",
            borderRadius: 11,
            border: `1.8px dashed ${theme.accent}77`,
            marginBottom: "-0.45em"
          }}
        >
          <span style={{ fontWeight: 600, color: theme.primary }}>
            Answer column is hidden from preview for classroom privacy.
          </span>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;

