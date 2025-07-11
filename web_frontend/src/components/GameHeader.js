import React from "react";

/**
 * PUBLIC_INTERFACE
 * Fixed header showing score, progress, and categories (student winnings only).
 * Props: {studentScore, mode, categories, questionsAsked, progress, theme}
 */
function GameHeader({
  studentScore = 0,
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

      {/* Score display: only total student winnings */}
      <div
        className="scores-box"
        aria-label="Score"
        style={{
          display: "flex",
          gap: "2.1em",
          alignItems: "center",
          background: "none"
        }}
      >
        <span
          className="scores-player"
          aria-label="Student's winnings"
          style={{
            background: `linear-gradient(110deg, ${theme.secondary} 93%, #fffde7 100%)`,
            color: "#161805",
            fontWeight: 900,
            fontSize: "1.20em",
            lineHeight: 1.19,
            padding: "0.22em 1.58em",
            borderRadius: "9px",
            boxShadow: "0 2px 8px #fff8e378",
            border: `2.5px solid ${theme.primary}18`
          }}
        >
          Total Won: {studentScore}
        </span>
      </div>
    </header>
  );
}

export default GameHeader;
