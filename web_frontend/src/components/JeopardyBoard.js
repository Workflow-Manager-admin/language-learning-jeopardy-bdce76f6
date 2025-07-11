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
            const cellUsed = asked[colIdx][rowIdx];
            const className =
              "board-row" + (cellUsed ? " asked" : "");
            const label = cellUsed
              ? "Used"
              : `${cat}, ${diff}, ${pointsMap[diff] ?? ""} points`;
            return (
              <button
                key={`${colIdx}-${rowIdx}`}
                className={className}
                tabIndex={cellUsed ? -1 : 0}
                style={{
                  background: cellUsed
                    ? "#cfd8dc"
                    : "#fff",
                  color: cellUsed
                    ? "#8e8e8e"
                    : theme.primary,
                  borderColor: cellUsed
                    ? "#ccd"
                    : theme.accent,
                }}
                disabled={cellUsed}
                aria-label={label}
                onClick={() => !cellUsed && onCellClick(rowIdx, colIdx)}
              >
                {cellUsed ? "✓" : pointsMap[diff]}pts
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default JeopardyBoard;
