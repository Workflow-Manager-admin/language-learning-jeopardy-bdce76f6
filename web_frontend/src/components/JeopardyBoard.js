import React from "react";

/**
 * PUBLIC_INTERFACE
 * Render Jeopardy-style game board as a responsive grid.
 * Props: { categories, difficultyLevels, grid, pointsMap, asked, onCellClick, theme }
 */
function JeopardyBoard({
  categories,
  difficultyLevels,
  grid,
  pointsMap,
  asked,
  onCellClick,
  theme,
}) {
  // Return number of rows (difficulties) and columns (categories)
  if (!categories?.length || !difficultyLevels?.length) return null;

  return (
    <div className="board-wrap" role="main" tabIndex={-1}>
      <div
        className="jeopardy-board"
        style={{
          gridTemplateColumns: `repeat(${categories.length}, 1fr)`,
          gridTemplateRows: `repeat(${difficultyLevels.length + 1}, auto)`,
        }}
        aria-label="Game board"
      >
        {/* Render category headers */}
        {categories.map((cat, col) => (
          <div className="board-category" key={`cat${col}`}>
            {cat}
          </div>
        ))}

        {/* Render cells as point values */}
        {difficultyLevels.map((diff, rowIdx) =>
          categories.map((cat, colIdx) => {
            const questionExists =
              !!(
                grid &&
                grid[colIdx] &&
                typeof grid[colIdx][rowIdx] !== "undefined" &&
                grid[colIdx][rowIdx]
              );
            const cellUsed = asked[colIdx][rowIdx];
            const disabled = cellUsed || !questionExists;
            const className =
              "board-row" +
              (cellUsed
                ? " asked"
                : !questionExists
                ? " disabled"
                : "");
            const label = cellUsed
              ? "Used"
              : !questionExists
              ? `No ${diff} question in ${cat} (unavailable)`
              : `${cat}, ${diff}, ${pointsMap[diff] ?? ""} points`;
            return (
              <button
                key={`${colIdx}-${rowIdx}`}
                className={className}
                tabIndex={disabled ? -1 : 0}
                style={{
                  background: cellUsed
                    ? "#cfd8dc"
                    : !questionExists
                    ? "#e7eaef"
                    : "#fff",
                  color: cellUsed
                    ? "#8e8e8e"
                    : !questionExists
                    ? "#b4b9c2"
                    : theme.primary,
                  borderColor: cellUsed
                    ? "#ccd"
                    : !questionExists
                    ? "#dde2ec"
                    : theme.accent,
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: !questionExists ? 0.6 : 1,
                }}
                disabled={disabled}
                aria-disabled={disabled}
                aria-label={label}
                onClick={() =>
                  !cellUsed &&
                  questionExists &&
                  onCellClick(rowIdx, colIdx)
                }
              >
                {cellUsed
                  ? "✓"
                  : !questionExists
                  ? "-"
                  : pointsMap[diff] + "pts"}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default JeopardyBoard;
