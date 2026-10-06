import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/navbar";

function UploadMedicalReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [patient, setPatient] = useState(null);
  const [file, setFile] = useState(null);
  const [recordType, setRecordType] = useState("other");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patients/${id}`);
        setPatient(response.data.patient);
      } catch (err) {
        console.error("Failed to fetch patient:", err);
        setError("Unable to load patient information.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setError("");
    setSuccess("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = ["application/pdf", "text/plain"];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF and TXT files are allowed.");
      setFile(null);
      e.target.value = "";
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("File size must be less than 10 MB.");
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a medical report first.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("patientId", id);
      formData.append("recordType", recordType);

      const response = await api.post(
        "/medical-records/upload",
        formData
      );

      setSuccess(
  response.data?.summaryGenerated
    ? "Medical report uploaded and AI summary generated successfully."
    : response.data?.message ||
      "Medical report uploaded successfully."
);

      setTimeout(() => {
        navigate(`/patients/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Failed to upload medical record:", err);

      setError(
        err.response?.data?.message ||
          "Failed to upload medical report. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${Math.round(bytes / 1024)} KB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="text-sm text-slate-500">
                Loading patient information...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-3 text-3xl">⚠️</div>

            <h2 className="text-lg font-semibold">
              Patient not found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              We couldn't load the selected patient's information.
            </p>

            <Link
              to="/patients"
              className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to Patients
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Back */}
        <Link
          to={`/patients/${id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          ← Back to Patient
        </Link>

        {/* Heading */}
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-600">
            Medical Records
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Upload Medical Report
          </h1>

          <p className="mt-2 text-slate-500">
            Upload a medical document for{" "}
            <span className="font-medium text-slate-700">
              {patient.name}
            </span>{" "}
            to extract its contents and prepare it for AI summarization.
          </p>
        </section>

        {/* Patient mini card */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              {patient.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                {patient.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Patient ID: {patient.patientId}
              </p>
            </div>
          </div>

          <div className="flex gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">Age</p>
              <p className="font-medium text-slate-700">
                {patient.age}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Gender</p>
              <p className="font-medium text-slate-700">
                {patient.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <form
          onSubmit={handleUpload}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Card header */}
          <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5 md:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                📄
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Medical Document
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a PDF or TXT medical document.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7 p-6 md:p-8">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <span>✓</span>
                <p>{success}</p>
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Medical Report <span className="text-red-500">*</span>
              </label>

              {!file ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center transition hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                    📤
                  </div>

                  <p className="font-semibold text-slate-800">
                    Click to select a medical report
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    PDF or TXT files only
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Maximum file size: 10 MB
                  </p>

                  <span className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-blue-700">
                    Choose File
                  </span>
                </button>
              ) : (
  <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        {/* File icon */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
          {file.type === "application/pdf" ? "📕" : "📄"}
        </div>

        {/* File information */}
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">
            {file.name}
          </p>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span>{formatFileSize(file.size)}</span>

            <span className="text-slate-300">•</span>

            <span>
              {file.type === "application/pdf"
                ? "PDF Document"
                : "Text Document"}
            </span>
          </div>

          <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            ✓ File ready for upload
          </div>
        </div>
      </div>

      {/* File actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          Change
        </button>

        <button
          type="button"
          onClick={removeFile}
          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
)}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Record Type */}
            <div>
              <label
                htmlFor="recordType"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Record Type
              </label>

              <select
                id="recordType"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              >
                <option value="clinical_note">
                  Clinical Note
                </option>

                <option value="psychiatric_report">
                  Psychiatric Report
                </option>

                <option value="therapy_note">
                  Therapy Note
                </option>

                <option value="prescription">
                  Prescription
                </option>

                <option value="other">
                  Other
                </option>
              </select>

              <p className="mt-2 text-xs text-slate-400">
                Choose the category that best describes the uploaded
                document.
              </p>
            </div>

            {/* Processing information */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
              <div className="flex items-start gap-3">
                <span className="text-lg">✨</span>

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    What happens after upload?
                  </p>

                  <ul className="mt-2 space-y-1.5 text-xs leading-5 text-blue-700">
                    <li>• Your document is securely uploaded.</li>
                    <li>• Text is automatically extracted.</li>
                    <li>• The extracted content is counted and stored.</li>
                    <li>• The report becomes available in the patient's records.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
            <Link
              to={`/patients/${id}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={!file || uploading}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
  <>
    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
    <span>Uploading & Generating Summary...</span>
  </>
) : (
  <>
    <span className="mr-2">✨</span>
    <span>Upload & Summarize Report</span>
  </>
)}
            </button>
          </div>
        </form>

        {/* Security note */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-sm">🔒</span>

          <p className="text-xs leading-5 text-slate-500">
            Medical documents contain sensitive information. Handle
            uploaded records securely and only use them for legitimate
            healthcare-related purposes.
          </p>
        </div>
      </main>
    </div>
  );
}

export default UploadMedicalReport;