import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
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
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Import Timetable JSON
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Paste JSON payload or upload a file with the same structure.
        </Typography>

        <Box component="form" onSubmit={submitPayload}>
          {errors.payload && <Alert severity="error">{errors.payload}</Alert>}

          <Box sx={{ display: "flex", gap: 2, my: 2 }}>
            <Button variant="outlined" component="label" disabled={isLoading}>
              Upload File
              <input
                type="file"
                hidden
                accept="application/json"
                onChange={(event) => handleFileUpload(event.target.files?.[0])}
              />
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setJsonValue(prettyTemplate);
                setErrors({});
              }}
              disabled={isLoading}
            >
              Reset to Sample
            </Button>
          </Box>

          <TextField
            id="timetable-payload"
            label="JSON Payload"
            multiline
            rows={20}
            value={jsonValue}
            onChange={(e) => setJsonValue(e.target.value)}
            error={Boolean(errors.payload)}
            helperText={errors.payload}
            disabled={isLoading}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Importing..." : "Import Timetable"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
