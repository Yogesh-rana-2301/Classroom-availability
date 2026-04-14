import { useMemo, useState } from "react";
import FormErrorSummary from "../../../shared/feedback/FormErrorSummary";
import TextInput from "../../../shared/forms/TextInput";
import { validateTimetableImportPayload } from "../../../shared/forms/validators";

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
  const [errors, setErrors] = useState({});

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
      setErrors({});
    } catch (_error) {
      setErrors({ payload: "Selected file does not contain valid JSON." });
    }
  }

  function submitPayload(event) {
    event.preventDefault();

    try {
      const payload = JSON.parse(jsonValue);
      const validation = validateTimetableImportPayload(payload);

      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      setErrors({});
      onUpload(payload);
    } catch (_error) {
      setErrors({
        payload: "JSON is invalid. Please fix syntax before importing.",
      });
    }
  }

  return (
    <section className="timetable-uploader">
      <h2>Import Timetable JSON</h2>
      <p>Paste JSON payload or upload a file with the same structure.</p>

      <form className="form-layout" onSubmit={submitPayload}>
        <div className="timetable-uploader-actions">
          <label className="form-field" htmlFor="timetable-file-input">
            <span className="form-label">Upload File</span>
            <TextInput
              id="timetable-file-input"
              type="file"
              accept="application/json"
              onChange={(event) => handleFileUpload(event.target.files?.[0])}
              disabled={isLoading}
              aria-describedby="timetable-file-help"
            />
            <span id="timetable-file-help" className="form-helper">
              Upload a JSON file with timetable schedule data.
            </span>
          </label>
          <button
            type="button"
            className="ca-button ca-button-secondary"
            onClick={() => {
              setJsonValue(prettyTemplate);
              setErrors({});
            }}
            disabled={isLoading}
          >
            Reset Sample
          </button>
        </div>

        <label className="form-field" htmlFor="timetable-json-input">
          <span className="form-label">Timetable JSON</span>
          <textarea
            id="timetable-json-input"
            className={`timetable-json-input${errors.payload || errors.schedule ? " form-input-invalid" : ""}`}
            value={jsonValue}
            onChange={(event) => {
              setJsonValue(event.target.value);
              setErrors((current) => ({
                ...current,
                payload: undefined,
                schedule: undefined,
              }));
            }}
            rows={18}
            spellCheck={false}
            disabled={isLoading}
            aria-invalid={Boolean(errors.payload || errors.schedule)}
            aria-describedby="timetable-json-help"
          />
          <span id="timetable-json-help" className="form-helper">
            Paste valid JSON. Invalid syntax or schema issues will be listed
            below.
          </span>
        </label>

        <FormErrorSummary errors={errors} title="Import blocked:" />

        <button className="form-submit" type="submit" disabled={isLoading}>
          {isLoading ? "Importing..." : "Import Timetable"}
        </button>
      </form>
    </section>
  );
}
