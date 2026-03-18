export default function TimetableUploader({ onUpload }) {
  return (
    <div>
      <h2>Upload Timetable</h2>
      <input
        type="file"
        accept="application/json"
        onChange={(event) => onUpload(event.target.files?.[0])}
      />
    </div>
  );
}
