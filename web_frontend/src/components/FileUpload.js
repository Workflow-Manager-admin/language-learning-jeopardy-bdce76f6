import React, { useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Component for uploading and parsing CSV/XLSX for Jeopardy game.
 * Accepts: { onParsed, theme }
 */
function FileUpload({ onParsed, theme }) {
  const fileInput = useRef();
  const [error, setError] = useState("");
  const [parsing, setParsing] = useState(false);

  // Parse the file as CSV or Excel
  const parseFile = (file) => {
    setError("");
    setParsing(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      let text = e.target.result;
      let questions = [];
      let categories = new Set();
      let difficultyLevels = new Set();

      // Attempt to detect file type by name & header
      const lower = file.name.toLowerCase();
      if (lower.endsWith(".csv")) {
        // CSV: parse header, then rows
        let rows = text.split(/\r?\n/).filter((row) => row.trim());
        let headerRow = rows[0].split(",");
        let idxMap = {};
        ['Category','Question','Answer','Difficulty'].forEach((col) => {
          idxMap[col] = headerRow.findIndex((h) =>
            h.trim().toLowerCase() === col.toLowerCase()
          );
        });
        if (
          Object.values(idxMap).some((v) => v === -1)
        ) {
          setError(
            "CSV must include Category, Question, Answer, Difficulty columns."
          );
          setParsing(false);
          return;
        }
        for (let i = 1; i < rows.length; ++i) {
          let cells = rows[i].split(",");
          const q = {
            category: cells[idxMap.Category]?.trim(),
            question: cells[idxMap.Question]?.trim(),
            answer: cells[idxMap.Answer]?.trim(),
            difficulty: cells[idxMap.Difficulty]?.trim(),
          };
          if (
            q.category &&
            q.question &&
            q.answer &&
            q.difficulty
          ) {
            questions.push(q);
            categories.add(q.category);
            difficultyLevels.add(q.difficulty);
          }
        }
      } else if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
        try {
          const XLSX = await import("xlsx");
          const workbook = XLSX.read(e.target.result, { type: "array" });
          const ws = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(ws, { defval: "" });

          for (const row of data) {
            const q = {
              category: row["Category"]?.toString().trim(),
              question: row["Question"]?.toString().trim(),
              answer: row["Answer"]?.toString().trim(),
              difficulty: row["Difficulty"]?.toString().trim(),
            };
            if (
              q.category &&
              q.question &&
              q.answer &&
              q.difficulty
            ) {
              questions.push(q);
              categories.add(q.category);
              difficultyLevels.add(q.difficulty);
            }
          }
        } catch (err) {
          setError("Failed to parse Excel file. Ensure it's a valid format.");
          setParsing(false);
          return;
        }
      } else {
        setError("File must be CSV or Excel (.csv, .xlsx, .xls).");
        setParsing(false);
        return;
      }

      if (questions.length < 4) {
        setError(
          "At least four questions are required with all columns filled."
        );
        setParsing(false);
        return;
      }
      const cats = Array.from(categories);
      const diffs = Array.from(difficultyLevels);
      questions.sort((a, b) => {
        if (a.category !== b.category)
          return a.category.localeCompare(b.category);
        return a.difficulty.localeCompare(b.difficulty);
      });
      onParsed({
        questions,
        categories: cats,
        difficultyLevels: diffs,
        previewItems: questions.slice(0, 7),
      });
      setParsing(false);
    };

    if (
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls")
    ) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  // When file selected
  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    parseFile(file);
  };

  // Show UI for file upload
  return (
    <div className="file-upload-area" aria-label="File upload area">
      <label className="file-upload-label" htmlFor="upload">
        Upload CSV or Excel file with columns: <b>Category, Question, Answer, Difficulty</b>
      </label>
      <input
        ref={fileInput}
        id="upload"
        className="upload-input"
        type="file"
        accept=".csv,.xlsx,.xls"
        aria-label="Upload file"
        onChange={onFileChange}
        disabled={parsing}
      />
      <button
        className="upload-btn"
        style={{ background: theme.accent }}
        onClick={() => fileInput.current && fileInput.current.click()}
        disabled={parsing}
      >
        {parsing ? "Processing..." : "Select File"}
      </button>
      {error && (
        <div style={{ color: "#b71c1c", marginTop: "1.2em", fontWeight: 600 }}>
          {error}
        </div>
      )}
      <div style={{ fontSize: "0.80em", color: "#888", marginTop: "2em", maxWidth: 400 }}>
        Dataset should have one row per question. <br />
        <span style={{ color: theme.primary }}>
          See README or template for details.
        </span>
      </div>
    </div>
  );
}

export default FileUpload;
