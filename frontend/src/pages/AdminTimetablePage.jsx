import { useState } from "react";
import { Link } from "react-router-dom";
import { TimetableUploader } from "../features/admin";
import { importTimetable } from "../features/admin/api/adminApi";
import Button from "../shared/components/Button";
import PageHeader from "../shared/components/PageHeader";

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
      <PageHeader
        title="Timetable Management"
        description="Upload and validate recurring official timetable slots."
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Admin" },
          { label: "Timetable" },
        ]}
        actions={
          <Link to="/admin/maintenance">
            <Button type="button" variant="secondary">
              Manage Room Status
            </Button>
          </Link>
        }
      />

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

      {isLoading ? (
        <p className="status-info" role="status">
          Import in progress. Validating payload and syncing timetable...
        </p>
      ) : null}

      <TimetableUploader onUpload={handleImport} isLoading={isLoading} />
    </section>
  );
}
