import React, { useState, useEffect, useCallback } from "react";
import JeopardyBoard from "./components/JeopardyBoard";
import FileUpload from "./components/FileUpload";
import GameHeader from "./components/GameHeader";
import QuestionModal from "./components/QuestionModal";
import PreviewModal from "./components/PreviewModal";
import FloatingButtons from "./components/FloatingButtons";
import usePersistentGameState from "./hooks/usePersistentGameState";
import "./App.css";

/**
 * Modal to prompt student to accept/reject Double or Nothing risk BEFORE showing the question
 */
function DoubleOrNothingChoiceModal({ onAccept, onDecline, theme }) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onDecline}
    >
      <div
        className="modal"
        tabIndex={0}
        style={{
          border: `3px solid ${theme.secondary}`,
          boxShadow: "0 8px 36px #ffea005a",
          background: "#fffbe9",
          color: theme.primary,
          minWidth: 320,
          maxWidth: "95vw",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-title" style={{ color: theme.secondary, fontWeight: 900 }}>
          Double or Nothing!
        </div>
        <div className="modal-question" style={{ color: theme.primary, fontWeight: 500 }}>
          If you accept this challenge, you'll risk <b>all your current winnings</b> for a chance to double them.
          <br />
          <br />
          <b>If you answer the question correctly:</b> Your winnings are doubled!<br />
          <b>If you answer incorrectly:</b> Your winnings will be reset to <span style={{ color: "#c62828" }}>0</span>.
        </div>
        <div className="modal-actions" style={{ marginTop: "1em" }}>
          <button
            className="btn secondary"
            style={{ background: theme.secondary, color: "#222" }}
            onClick={onAccept}
          >
            Take the Risk
          </button>
          <button
            className="btn"
            style={{ background: theme.primary, color: "#fff" }}
            onClick={onDecline}
          >
            Play as Normal
          </button>
        </div>
      </div>
    </div>
  );
}

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

  // Local transient state for question modal (and for DoN modal)
  const [questionModal, setQuestionModal] = useState({
    open: false,
    cell: null, // {row, col}
  });
  const [doubleOrNothingModal, setDoubleOrNothingModal] = useState({
    open: false,
    cell: null,
  });
  const [pendingNormalCell, setPendingNormalCell] = useState(null); // If user "declines" DoN

  // --- Helper to randomly pick two unique cells for DoN ---
  function pickDoubleOrNothingCells({ categories, difficultyLevels, grid, asked }) {
    // Pick only cells that have a question (not undefined), and not asked
    let availableCells = [];
    for (let col = 0; col < categories.length; ++col) {
      for (let row = 0; row < difficultyLevels.length; ++row) {
        if (
          grid &&
          grid[col] &&
          grid[col][row] &&
          !asked[col][row]
        ) {
          availableCells.push({ row, col });
        }
      }
    }
    // Shuffle & pick 2 unique
    if (availableCells.length < 2) return [];
    for (let i = availableCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
    }
    return [availableCells[0], availableCells[1]];
  }

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

      // Initialize game state but don't pick DoN cells until game starts (for true randomness)
      setPersistedState({
        questions,
        categories,
        difficultyLevels,
        grid,
        pointsMap,
        asked: Array(categories.length)
          .fill(0)
          .map(() => Array(difficultyLevels.length).fill(false)),
        studentScore: 0,
        // Remove teacher-vs-student; only track student winnings
        mode: "preview",
        previewItems,
        progress: 0,
        doubleOrNothingCells: null, // Not assigned until first play
      });
    },
    [setPersistedState]
  );

  // Begin game after preview;
  // Pick and persist the doN cells if not already set
  const startGame = () => {
    setPersistedState((prev) => {
      let next = { ...prev, mode: "playing" };
      if (!prev.doubleOrNothingCells) {
        // Choose cells for DoN; ensure they're not already asked (shouldn't happen on new game)
        const picked = pickDoubleOrNothingCells(prev);
        next.doubleOrNothingCells = picked;
      }
      return next;
    });
  };

  // When a board cell is clicked
  const onCellClick = (rowIdx, colIdx) => {
    if (
      !persistedState.asked[colIdx][rowIdx] &&
      persistedState.mode === "playing"
    ) {
      const doNCells = persistedState.doubleOrNothingCells || [];
      const isDoubleOrNothing =
        doNCells.find(
          (c) => c.row === rowIdx && c.col === colIdx
        ) !== undefined;

      if (isDoubleOrNothing) {
        setDoubleOrNothingModal({ open: true, cell: { row: rowIdx, col: colIdx } });
      } else {
        setQuestionModal({ open: true, cell: { row: rowIdx, col: colIdx }, doubleOrNothing: false });
      }
    }
  };

  // When modal is closed without marking (e.g., overlay/cancel)
  const closeModal = () => setQuestionModal({ open: false, cell: null });

  // Called when the DoN modal is accepted.
  const onDoubleOrNothingAccept = () => {
    // Open the question modal but flag as DoN
    setQuestionModal({
      open: true,
      cell: doubleOrNothingModal.cell,
      doubleOrNothing: true,
    });
    setDoubleOrNothingModal({ open: false, cell: null });
  };

  // Called when the DoN modal is declined.
  const onDoubleOrNothingDecline = () => {
    // Open the question modal ~as normal
    setQuestionModal({
      open: true,
      cell: doubleOrNothingModal.cell,
      doubleOrNothing: false,
    });
    setDoubleOrNothingModal({ open: false, cell: null });
  };

  // Handle answer marking, differentiate DoN scenario vs normal
  const onMarkAnswer = (correct) => {
    const { cell, doubleOrNothing } = questionModal;
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
    let newStudentScore = persistedState.studentScore || 0;

    // Find if this cell is (was) DoN
    const isDoN =
      persistedState.doubleOrNothingCells &&
      persistedState.doubleOrNothingCells.some(
        c => c.row === row && c.col === col
      );

    if (doubleOrNothing && isDoN) {
      // If student accepted DoN
      if (correct) {
        newStudentScore = newStudentScore * 2;
      } else {
        newStudentScore = 0;
      }
    } else {
      if (correct) {
        newStudentScore += pointVal;
      }
    }

    const totalQuestions =
      persistedState.categories.length * persistedState.difficultyLevels.length;
    const progress =
      newAsked.flat().filter((a) => a).length / totalQuestions;

    setPersistedState((prev) => ({
      ...prev,
      asked: newAsked,
      studentScore: newStudentScore,
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
        studentScore={persistedState?.studentScore}
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
            doubleOrNothingCells={persistedState.doubleOrNothingCells}
          />
        )}

      {/* Double or Nothing pre-question prompt */}
      {doubleOrNothingModal.open && (
        <DoubleOrNothingChoiceModal
          onAccept={onDoubleOrNothingAccept}
          onDecline={onDoubleOrNothingDecline}
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
