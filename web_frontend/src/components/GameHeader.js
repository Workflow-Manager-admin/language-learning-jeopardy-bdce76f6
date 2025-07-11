import React from "react";

/**
 * PUBLIC_INTERFACE
 * Fixed header showing scores, turn, progress, and categories.
 * Props: {scores, turn, mode, categories, questionsAsked, progress, theme}
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
  // Calculate totals
  const total =
    categories.length *
    (questionsAsked[0]?.length || 0) ||
    1;
  const asked =
    questionsAsked.flat().filter(Boolean).length;

  return (
    <header className="game-header" aria-label="Game status">
      <span
        style={{
          color: theme.primary,
          fontWeight: 700,
          fontSize: "1.14em",
          letterSpacing: "-0.01em",
        }}
      >
        Language Jeopardy
      </span>
      {mode !== "init" && categories.length > 0 && (
        <div
          className="progress-bar-bg"
          aria-label={`${Math.round(progress * 100)}% complete`}
        >
          <div
            className="progress-bar-fg"
            style={{
              width: `${Math.round(progress * 100)}%`,
              background: theme.accent,
            }}
          ></div>
        </div>
      )}
      <div className="scores-box" aria-label="Scores">
        <span
          className={`scores-player teacher`}
          style={{
            background: theme.primary,
            color: "#fff",
          }}
        >
          Teacher: {scores[0]}
        </span>
        <span className="scores-player" style={{ background: theme.secondary, color: "#111" }}>
          Student: {scores[1]}
        </span>
        {mode === "playing" && (
          <span
            className="turn-indicator"
            style={{
              background: theme.accent,
              color: "#fff",
            }}
            aria-label={turn === 0 ? "Teacher's turn" : "Student's turn"}
          >
            {turn === 0 ? "Teacher" : "Student"} turn
          </span>
        )}
      </div>
    </header>
  );
}

export default GameHeader;
