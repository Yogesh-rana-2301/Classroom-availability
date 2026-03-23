import { useMemo, useState } from "react";

const samplePayload = {
  academic_year: "2025-2026",
  department: "Computer Science and Engineering",
  schedule: {
    Monday: {
      "09:00-10:00": [
        {
          course: "CSN4004-CAO G2",
          venue: "L22",
        },
      ],
      "10:00-11:00": [
        {
          course: "DSN4003-AI",
          venue: "L407, Lab 304",
        },
      ],
    },
  },
};

export default function TimetableUploader({ onUpload, isLoading = false }) {
  const [jsonValue, setJsonValue] = useState(
    JSON.stringify(samplePayload, null, 2),
  );
  const [parseError, setParseError] = useState("");

  const prettyTemplate = useMemo(
    () => JSON.stringify(samplePayload, null, 2),
    [],
  );

  async function handleFileUpload(file) {
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      JSON.parse(text);
      setJsonValue(text);
      setParseError("");
    } catch (_error) {
      setParseError("Selected file does not contain valid JSON.");
    }
  }

  function submitPayload(event) {
    event.preventDefault();

    try {
      const payload = JSON.parse(jsonValue);
      setParseError("");
      onUpload(payload);
    } catch (_error) {
      setParseError("JSON is invalid. Please fix syntax before importing.");
    }
  }

  return (
    <section className="timetable-uploader">
      <h2>Import Timetable JSON</h2>
      <p>Paste JSON payload or upload a file with the same structure.</p>

      <form onSubmit={submitPayload}>
        <div className="timetable-uploader-actions">
          <label>
            Upload file
            <input
              type="file"
              accept="application/json"
              onChange={(event) => handleFileUpload(event.target.files?.[0])}
              disabled={isLoading}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setJsonValue(prettyTemplate);
              setParseError("");
            }}
            disabled={isLoading}
          >
            Reset Sample
          </button>
        </div>

        <label>
          Timetable JSON
          <textarea
            className="timetable-json-input"
            value={jsonValue}
            onChange={(event) => setJsonValue(event.target.value)}
            rows={18}
            spellCheck={false}
            disabled={isLoading}
          />
        </label>

        {parseError ? (
          <p className="status-error" role="alert">
            {parseError}
          </p>
        ) : null}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Importing..." : "Import Timetable"}
        </button>
      </form>
    </section>
  );
}
