import React from "react";

/**
 * PUBLIC_INTERFACE
 * Render Jeopardy-style game board as a responsive grid.
 * Props: { categories, difficultyLevels, grid, pointsMap, asked, onCellClick, theme, doubleOrNothingCells }
 */
function JeopardyBoard({
  categories,
  difficultyLevels,
  grid,
  pointsMap,
  asked,
  onCellClick,
  theme,
  doubleOrNothingCells = [],
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
            const isDoN =
              doubleOrNothingCells &&
              doubleOrNothingCells.some(
                (c) => c.row === rowIdx && c.col === colIdx
              );
            const disabled = cellUsed || !questionExists;
            const className =
              "board-row" +
              (cellUsed
                ? " asked"
                : !questionExists
                ? " disabled"
                : isDoN
                ? " don-cell"
                : "");
            const label = cellUsed
              ? "Used"
              : !questionExists
              ? `No ${diff} question in ${cat} (unavailable)`
              : isDoN
              ? `${cat}, ${diff}, Double or Nothing cell (${pointsMap[diff] ?? ""} points)`
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
                    : isDoN
                    ? "linear-gradient(101deg,#fffde4 80%,#ffd60044 100%)"
                    : "#fff",
                  color: cellUsed
                    ? "#8e8e8e"
                    : !questionExists
                    ? "#b4b9c2"
                    : isDoN
                    ? theme.secondary
                    : theme.primary,
                  borderColor: cellUsed
                    ? "#ccd"
                    : !questionExists
                    ? "#dde2ec"
                    : isDoN
                    ? "#ffd600"
                    : theme.accent,
                  fontWeight: isDoN ? 900 : undefined,
                  fontSize: isDoN ? "1.13em" : undefined,
                  boxShadow: isDoN
                    ? "0 1px 8px #ffe083"
                    : undefined,
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: !questionExists ? 0.6 : 1,
                  position: "relative",
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
                  : isDoN
                  ? (
                    <span title="Double or Nothing cell">
                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: "1.13em",
                          marginRight: 2,
                          verticalAlign: "middle",
                        }}
                      >
                        🎲
                      </span>
                      {pointsMap[diff]}pts
                    </span>
                  )
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
