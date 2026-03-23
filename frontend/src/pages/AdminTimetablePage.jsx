import { useState } from "react";
import { TimetableUploader } from "../features/admin";
import { importTimetable } from "../features/admin/api/adminApi";

export default function AdminTimetablePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleImport(payload) {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await importTimetable(payload);
      setResult(response);
    } catch (requestError) {
      const backendMessage = requestError?.response?.data?.message;
      const backendErrors = requestError?.response?.data?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        setError(
          backendErrors
            .map((item) => item?.message)
            .filter(Boolean)
            .join(" | "),
        );
      } else {
        setError(
          backendMessage ||
            "Timetable import failed. Verify payload and try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="page admin-timetable-page">
      <h1>Timetable Management</h1>
      <p>Upload and validate recurring official timetable slots.</p>

      {error ? (
        <p className="status-error" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="admin-import-result" role="status">
          <h2>Import Summary</h2>
          <p>{result.message || "Timetable imported successfully."}</p>
          <ul>
            <li>Imported classrooms: {result.importedClassrooms ?? 0}</li>
            <li>Imported slots: {result.importedSlots ?? 0}</li>
            <li>Payload entries processed: {result.payloadPreview ?? 0}</li>
          </ul>
        </div>
      ) : null}

      <TimetableUploader onUpload={handleImport} isLoading={isLoading} />
    </section>
  );
}
