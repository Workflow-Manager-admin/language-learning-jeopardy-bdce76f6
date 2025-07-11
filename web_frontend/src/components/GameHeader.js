import React from "react";

/**
 * PUBLIC_INTERFACE
 * Fixed header showing scores, turn, progress, and categories.
 * Props: {scores, turn, mode, categories, questionsAsked, progress, theme}
 *
 * Enhanced for: higher contrast, bolder scores, larger clickable/touch targets, responsive to large and small screens,
 * accessible ARIA labels, and abundant comments explaining all polish changes.
 */
function GameHeader({
  scores = [0, 0],
  turn = 0,
  mode = "init",
  categories = [],
  questionsAsked = [],
  progress = 0,
  theme,
}) {
  const total = categories.length * (questionsAsked[0]?.length || 0) || 1;
  const asked = questionsAsked.flat().filter(Boolean).length;

  return (
    <header
      className="game-header"
      aria-label="Game status and info"
      style={{
        background: theme.secondary + "05",
        padding: "0.45em 2.2em 0.45em 1.1em",
        boxShadow: "0 7px 18px #0001",
        borderBottom: `2px solid ${theme.primary}22`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 9,
        position: "sticky",
        top: 0,
        minHeight: 70
      }}
    >
      {/* Visually distinctive app/game name, accessible to screen readers */}
      <span
        style={{
          color: theme.primary,
          fontWeight: 800,
          fontSize: "1.32em",
          letterSpacing: "-0.01em",
          lineHeight: 1.21,
          textShadow: "0 3px 7px #a3bef3b3",
          userSelect: "none"
        }}
      >
        Language Jeopardy
      </span>
      {/* Show progressbar only after dataset loaded */}
      {mode !== "init" && categories.length > 0 && (
        <div
          className="progress-bar-bg"
          aria-label={`${Math.round(progress * 100)}% complete`}
          style={{
            height: 16,
            width: 180,
            background: "#e3eaef",
            borderRadius: 9,
            marginLeft: "0.7em",
            overflow: "hidden",
            boxShadow: "0 3px 6px #87accc27",
            position: "relative",
            flex: "0 0 180px",
            border: `2px solid ${theme.accent}44`,
            transition: "background 0.14s"
          }}
        >
          <div
            className="progress-bar-fg"
            style={{
              height: "100%",
              width: `${Math.round(progress * 100)}%`,
              background:
                progress === 1
                  ? theme.primary
                  : `linear-gradient(88deg, ${theme.accent} 80%, ${theme.secondary} 100%)`,
              transition: "width 0.55s cubic-bezier(.4,2,.6,1)",
              borderRadius: 7
            }}
          ></div>
        </div>
      )}
      {/* Score, turn indicator: highly visible boxes */}
      <div
        className="scores-box"
        aria-label="Scores"
        style={{
          display: "flex",
          gap: "2.1em",
          alignItems: "center",
          background: "none"
        }}
      >
        <span
          className="scores-player teacher"
          aria-label="Teacher's Score"
          style={{
            background: `linear-gradient(123deg, ${theme.primary} 78%, #246ec1 100%)`,
            color: "#fff",
            fontWeight: 900,
            fontSize: "1.18em",
            lineHeight: 1.19,
            padding: "0.2em 1.38em",
            borderRadius: "9px",
            boxShadow: "0 2px 8px #aac8ff34",
            border: `2.5px solid ${theme.secondary}88`,
            outline: "none"
          }}
        >
          Teacher: {scores[0]}
        </span>
        <span
          className="scores-player"
          aria-label="Student's Score"
          style={{
            background: `linear-gradient(110deg, ${theme.secondary} 93%, #fffde7 100%)`,
            color: "#161805",
            fontWeight: 900,
            fontSize: "1.13em",
            lineHeight: 1.19,
            padding: "0.20em 1.36em",
            borderRadius: "9px",
            boxShadow: "0 2px 8px #fff8e378",
            border: `2.5px solid ${theme.primary}18`
          }}
        >
          Student: {scores[1]}
        </span>
        {mode === "playing" && (
          <span
            className="turn-indicator"
            aria-label={turn === 0 ? "Teacher's turn" : "Student's turn"}
            style={{
              background: `linear-gradient(88deg, ${theme.accent} 80%, #77e596 100%)`,
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.04em",
              padding: "0.17em 0.98em",
              borderRadius: "6px",
              marginLeft: "0.29em",
              minWidth: 92,
              boxShadow: "0 1px 6px #b0ffd255",
              textAlign: "center",
              outline: "none"
            }}
          >
            {turn === 0 ? "Teacher" : "Student"} turn
          </span>
        )}
      </div>
    </header>
  );
}

export default GameHeader;
