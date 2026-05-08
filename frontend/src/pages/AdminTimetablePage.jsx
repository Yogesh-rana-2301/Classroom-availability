import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
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
    <Container maxWidth="lg">
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <MuiLink
          component={Link}
          underline="hover"
          color="inherit"
          to="/dashboard"
        >
          Dashboard
        </MuiLink>
        <Typography color="text.primary">Admin</Typography>
        <Typography color="text.primary">Timetable</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            Timetable Management
          </Typography>
          <Typography>
            Upload and validate recurring official timetable slots.
          </Typography>
        </Box>
        <Button component={Link} to="/admin/maintenance" variant="outlined">
          Manage Room Status
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <h2>Import Summary</h2>
          <p>{result.message || "Timetable imported successfully."}</p>
          <ul>
            <li>Imported classrooms: {result.importedClassrooms ?? 0}</li>
            <li>Imported slots: {result.importedSlots ?? 0}</li>
            <li>Payload entries processed: {result.payloadPreview ?? 0}</li>
          </ul>
        </Alert>
      )}

      {isLoading && <CircularProgress sx={{ mt: 2 }} />}

      <TimetableUploader onUpload={handleImport} isLoading={isLoading} />
    </Container>
  );
}
