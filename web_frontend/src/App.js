import React, { useState, useEffect, useCallback } from "react";
import JeopardyBoard from "./components/JeopardyBoard";
import FileUpload from "./components/FileUpload";
import GameHeader from "./components/GameHeader";
import QuestionModal from "./components/QuestionModal";
import PreviewModal from "./components/PreviewModal";
import FloatingButtons from "./components/FloatingButtons";
import usePersistentGameState from "./hooks/usePersistentGameState";
import "./App.css";

// Color theme provided
const THEME = {
  primary: "#1565c0",
  secondary: "#ffd600",
  accent: "#43a047",
};

/**
 * PUBLIC_INTERFACE
 * Main App Component for Jeopardy game.
 * Controls persistent state, layout, and PWA offline support.
 */
function App() {
  // All game state is managed here and persisted for refreshes
  const {
    persistedState, // { questions, categories, grid, pointsMap, mode, ... }
    setPersistedState,
    clearPersistedState,
  } = usePersistentGameState();

  // Local transient state
  const [questionModal, setQuestionModal] = useState({
    open: false,
    cell: null, // {row, col}
  });

  // Handle file upload and successful parse from child
  const onUploadParsed = useCallback(
    ({ questions, categories, difficultyLevels, previewItems }) => {
      // Assign points: e.g., 100 for easiest per category, increment by 100 per row
      const pointsMap = {};
      difficultyLevels.forEach((diff, idx) => {
        pointsMap[diff] = 100 * (idx + 1);
      });

      // Organize grid: columns = categories, rows = difficulties
      const grid = categories.map((cat) =>
        difficultyLevels.map((diff) =>
          questions.find(
            (q) => q.category === cat && q.difficulty === diff
          )
        )
      );

      setPersistedState({
        questions,
        categories,
        difficultyLevels,
        grid,
        pointsMap,
        asked: Array(categories.length)
          .fill(0)
          .map(() => Array(difficultyLevels.length).fill(false)),
        scores: [0, 0],
        turn: 0,
        mode: "preview",
        previewItems,
        progress: 0,
      });
    },
    [setPersistedState]
  );

  // Begin game after preview
  const startGame = () => {
    setPersistedState((prev) => ({
      ...prev,
      mode: "playing",
    }));
  };

  // When a board cell is clicked
  const onCellClick = (rowIdx, colIdx) => {
    if (
      !persistedState.asked[colIdx][rowIdx] &&
      persistedState.mode === "playing"
    ) {
      setQuestionModal({ open: true, cell: { row: rowIdx, col: colIdx } });
    }
  };

  // When modal is closed without marking (e.g., overlay/cancel)
  const closeModal = () => setQuestionModal({ open: false, cell: null });

  // Handle answer marking (and alternate turn, update scores/asked/progress)
  const onMarkAnswer = (correct) => {
    const { cell } = questionModal;
    if (!cell || !persistedState) {
      closeModal();
      return;
    }

    const col = cell.col, row = cell.row;
    const newAsked = persistedState.asked.map((arr, c) =>
      arr.map((v, r) =>
        c === col && r === row ? true : v
      )
    );
    const pointVal =
      persistedState.pointsMap[persistedState.difficultyLevels[row]] || 0;
    const scores = [...persistedState.scores];
    if (correct) {
      scores[persistedState.turn] += pointVal;
    }
    // Alternate turn (0/1).
    const totalQuestions =
      persistedState.categories.length * persistedState.difficultyLevels.length;
    const progress =
      newAsked.flat().filter((a) => a).length / totalQuestions;

    setPersistedState((prev) => ({
      ...prev,
      asked: newAsked,
      scores,
      turn: 1 - prev.turn,
      progress,
    }));
    closeModal();
  };

  // Reset to allow file re-upload and clear persistent state
  const onReset = useCallback(() => {
    clearPersistedState();
    setQuestionModal({ open: false, cell: null });
  }, [clearPersistedState]);

  // Full offline support: prompt on reload if a game is in progress
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        persistedState &&
        persistedState.mode === "playing" &&
        persistedState.progress > 0 &&
        persistedState.progress < 1
      ) {
        e.preventDefault();
        e.returnValue =
          "There is a game in progress. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [persistedState]);

  // Responsive/classroom-friendly high-contrast main layout
  return (
    <div className="jeopardy-app" style={{ background: "#f7fafc", minHeight: "100vh" }}>
      <GameHeader
        scores={persistedState?.scores}
        turn={persistedState?.turn}
        mode={persistedState?.mode}
        categories={persistedState?.categories}
        questionsAsked={persistedState?.asked}
        progress={persistedState?.progress}
        theme={THEME}
      />

      {/* File upload and preview */}
      {!persistedState?.questions && (
        <FileUpload
          onParsed={onUploadParsed}
          theme={THEME}
        />
      )}

      {/* Preview before starting actual game */}
      {persistedState?.questions &&
        persistedState.mode === "preview" && (
          <PreviewModal
            items={persistedState.previewItems}
            onStart={startGame}
            onReset={onReset}
            theme={THEME}
          />
        )}

      {/* Gameboard */}
      {persistedState?.questions &&
        persistedState.mode !== "preview" && (
          <JeopardyBoard
            categories={persistedState.categories}
            difficultyLevels={persistedState.difficultyLevels}
            grid={persistedState.grid}
            pointsMap={persistedState.pointsMap}
            asked={persistedState.asked}
            onCellClick={onCellClick}
            theme={THEME}
          />
        )}

      {/* Question Modal */}
      {questionModal.open && (
        <QuestionModal
          question={
            persistedState.grid[questionModal.cell.col][questionModal.cell.row]
          }
          points={
            persistedState.pointsMap[
              persistedState.difficultyLevels[questionModal.cell.row]
            ]
          }
          onClose={closeModal}
          onMarkAnswer={onMarkAnswer}
          theme={THEME}
        />
      )}

      {/* Floating actions (reset/file-upload) */}
      <FloatingButtons
        showReset={Boolean(persistedState?.questions)}
        onReset={onReset}
        theme={THEME}
      />

      {/* PWA offline status banner */}
      <div
        id="pwa-offline-banner"
        aria-live="polite"
        style={{
          display: navigator.onLine ? "none" : "block",
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: THEME.secondary,
          color: "#333",
          textAlign: "center",
          padding: "0.6em",
          fontWeight: 600,
          zIndex: 2000,
        }}
      >
        Offline mode: App fully functional
      </div>
    </div>
  );
}

export default App;
