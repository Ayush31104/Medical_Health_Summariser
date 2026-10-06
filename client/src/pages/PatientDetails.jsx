import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/navbar";

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true);

  const [error, setError] = useState("");
  const [recordsError, setRecordsError] = useState("");

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/patients/${id}`);

      // Backend returns { success, patient }
      setPatient(response.data.patient);
    } catch (err) {
      console.error("Failed to fetch patient:", err);

      setError(
        err.response?.data?.message || "Failed to load patient information.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      setRecordsLoading(true);

      const response = await api.get(`/medical-records/patient/${id}`);

      setRecords(response.data.records || []);
    } catch (err) {
      console.error("Failed to fetch records:", err);

      setRecordsError(
        err.response?.data?.message || "Failed to load medical records.",
      );
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
    fetchRecords();
  }, [id]);

  const generateSummary = async (recordId) => {
    try {
      setSummaryLoading(true);
      setError("");

      const response = await api.post(`/medical-records/${recordId}/summarize`);

      if (response.data.success) {
        // Update the record in the current list
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record._id === recordId
              ? {
                  ...record,
                  aiSummary: response.data.summary,
                  summaryGeneratedAt: response.data.summaryGeneratedAt,
                }
              : record,
          ),
        );
      }
    } catch (error) {
      console.error("Generate AI summary error:", error);

      setError(
        error.response?.data?.message || "Failed to generate AI summary",
      );
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medical record?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/medical-records/${recordId}`);

      setRecords((currentRecords) =>
        currentRecords.filter((record) => record._id !== recordId),
      );
    } catch (err) {
      console.error("Failed to delete record:", err);

      alert(err.response?.data?.message || "Failed to delete medical record.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatRecordType = (type) => {
    if (!type) return "Other";

    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getFileIcon = (fileName) => {
    if (fileName?.toLowerCase().endsWith(".pdf")) {
      return "📕";
    }

    return "📄";
  };

  const getInitials = (name) => {
    if (!name) return "P";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const renderList = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return (
        <p className="text-sm text-slate-400">Not mentioned in the report.</p>
      );
    }

    return (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex gap-3 text-sm leading-6 text-slate-700"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>
              {typeof item === "string" ? item : JSON.stringify(item)}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const renderTest = (test, index) => {
    if (!test || typeof test !== "object") {
      return null;
    }

    const testName = String(test.name || test.test || "").trim();

    // Never display generic/incomplete test entries.
    if (
      !testName ||
      ["test", "tests", "result", "results"].includes(testName.toLowerCase())
    ) {
      return null;
    }

    const result = String(test.result || "").trim();

    const unit = String(test.unit || "").trim();

    const referenceRange = String(test.referenceRange || "").trim();

    return (
      <div
        key={index}
        className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{testName}</p>

            {result && (
              <p className="mt-2 text-sm text-slate-600">
                Result:{" "}
                <span className="font-semibold text-slate-900">{result}</span>
                {unit && <span className="ml-1 text-slate-500">{unit}</span>}
              </p>
            )}
          </div>

          {unit && (
            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {unit}
            </span>
          )}
        </div>

        {referenceRange && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Reference Range
            </p>

            <p className="mt-1 text-sm text-slate-600">{referenceRange}</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-10">
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

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-10">
          <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-4 text-4xl">⚠️</div>

            <h2 className="text-xl font-bold text-slate-900">
              Unable to load patient
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error || "Patient information could not be found."}
            </p>

            <Link
              to="/patients"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Back */}
        <Link
          to="/patients"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          ← Back to Patients
        </Link>

        {/* Patient Hero */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-8 text-white md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold ring-1 ring-white/20">
                  {getInitials(patient.name)}
                </div>

                <div>
                  <p className="text-sm font-medium text-blue-100">
                    Patient Profile
                  </p>

                  <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                    {patient.name}
                  </h1>

                  <p className="mt-1 text-sm text-blue-100">
                    Patient ID: {patient.patientId}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/patients/${id}/edit`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  ✏️ Edit Patient
                </Link>

                <Link
                  to={`/patients/${id}/upload`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
                >
                  + Upload Medical Report
                </Link>
              </div>
            </div>
          </div>

          {/* Patient basic information */}
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Age
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-800">
                {patient.age} years
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Gender
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-800">
                {patient.gender}
              </p>
            </div>

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Contact
              </p>

              <p className="mt-2 break-words text-lg font-semibold text-slate-800">
                {patient.contact || "Not provided"}
              </p>
            </div>
          </div>
        </section>

        {/* Medical History */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Patient Information
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Medical History
              </h2>
            </div>

            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
              Profile
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            {patient.medicalHistory ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {patient.medicalHistory}
              </p>
            ) : (
              <p className="text-sm italic text-slate-400">
                No medical history has been added for this patient.
              </p>
            )}
          </div>
        </section>

        {/* Medical Records */}
<section>

  <div className="mb-5 flex items-end justify-between">
    <div>
      <h3 className="text-xl font-bold text-slate-900">
        Medical Records
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {records.length} medical record
        {records.length !== 1 ? "s" : ""} uploaded for this patient.
      </p>
    </div>

    <Link
      to={`/patients/${id}/upload`}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
    >
      <span>＋</span>
      Upload Report
    </Link>
  </div>

          {/* Loading */}
          {recordsLoading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-sm text-slate-500">
                Loading medical records...
              </p>
            </div>
          )}

          {/* Error */}
          {!recordsLoading && recordsError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm font-medium text-red-700">{recordsError}</p>

              <button
                type="button"
                onClick={fetchRecords}
                className="mt-3 text-sm font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!recordsLoading && !recordsError && records.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                📄
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                No medical records yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Upload the patient's first medical report to start building
                their digital medical record.
              </p>

              <Link
                to={`/patients/${id}/upload`}
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Upload First Report
              </Link>
            </div>
          )}

          {/* Records */}
          {!recordsLoading && !recordsError && records.length > 0 && (
            <div className="space-y-4">
              {records.map((record) => (
                <article
                  key={record._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    {/* File information */}
<div className="flex min-w-0 gap-4">
  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
    {getFileIcon(record.fileName)}
  </div>

  <div className="min-w-0">
    <h3 className="truncate text-base font-bold text-slate-900">
      {record.fileName || "Medical Report"}
    </h3>

    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        {formatRecordType(record.recordType)}
      </span>

      <span className="text-xs text-slate-400">
        Uploaded {formatDate(record.createdAt)}
      </span>
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-2">
      {record.aiSummary ? (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          ✓ AI Summary Available
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          • AI Summary Not Generated
        </span>
      )}

      {record.extractedText && (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          ✓ Processed
        </span>
      )}
    </div>
  </div>
</div>

                    {/* Actions */}
<div className="flex shrink-0 flex-wrap gap-2">
    {/* View Original File */}
    <button
        type="button"
        onClick={() =>
            window.open(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/medical-records/${record._id}/file`,
                "_blank",
                "noopener,noreferrer"
            )
        }
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
        <span>📄</span>
        View File
    </button>

    {/* Generate / Regenerate AI Summary */}
    <button
        type="button"
        onClick={() => generateSummary(record._id)}
        disabled={summaryLoading}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
        <span>✨</span>
        {summaryLoading
            ? "Generating..."
            : record.aiSummary
                ? "Regenerate Summary"
                : "Generate AI Summary"}
    </button>

    {/* Delete */}
    <button
        type="button"
        onClick={() => handleDeleteRecord(record._id)}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
    >
        <span>🗑️</span>
        Delete
    </button>
</div>
                  </div>

                  {/* Record metadata */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-slate-400">Word Count</p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {record.wordCount || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">File Type</p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {record.fileName?.split(".").pop()?.toUpperCase() ||
                          "FILE"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Status</p>

                      <p className="mt-1 text-sm font-semibold text-emerald-600">
                        Processed
                      </p>
                    </div>
                  </div>

                  {record.aiSummary && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                      {/* AI Header */}
                      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm">
                              ✨
                            </div>

                            <div>
                              <h4 className="text-lg font-bold text-slate-900">
                                AI Medical Summary
                              </h4>

                              <p className="mt-1 text-xs text-slate-500">
                                AI-generated from the uploaded medical report
                              </p>
                            </div>
                          </div>

                          {record.summaryGeneratedAt && (
                            <span className="hidden rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm sm:block">
                              {formatDate(record.summaryGeneratedAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Summary Content */}
                      <div className="space-y-6 p-6">
                        {/* Patient Overview */}
                        {record.aiSummary.patientOverview && (
                          <section>
                            <div className="mb-3 flex items-center gap-2">
                              <span className="text-lg">👤</span>

                              <h5 className="font-semibold text-slate-900">
                                Patient Overview
                              </h5>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  Name
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                  {record.aiSummary.patientOverview.name ||
                                    "Not mentioned"}
                                </p>
                              </div>

                              <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  Age
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                  {record.aiSummary.patientOverview.age ||
                                    "Not mentioned"}
                                </p>
                              </div>

                              <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  Gender
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                  {record.aiSummary.patientOverview.gender ||
                                    "Not mentioned"}
                                </p>
                              </div>

                              <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  Report Type
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                  {record.aiSummary.patientOverview
                                    .reportType || "Not mentioned"}
                                </p>
                              </div>
                            </div>
                          </section>
                        )}

                        {/* Key Findings */}
                        <section>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-lg">🔎</span>

                            <h5 className="font-semibold text-slate-900">
                              Key Findings
                            </h5>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                            {renderList(record.aiSummary.keyFindings)}
                          </div>
                        </section>

                        {/* Diagnoses */}
                        <section>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-lg">🩺</span>

                            <h5 className="font-semibold text-slate-900">
                              Diagnoses / Conditions
                            </h5>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                            {renderList(record.aiSummary.diagnoses)}
                          </div>
                        </section>

                        {/* Medications */}
                        <section>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-lg">💊</span>

                            <h5 className="font-semibold text-slate-900">
                              Medications
                            </h5>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                            {renderList(record.aiSummary.medications)}
                          </div>
                        </section>

                        {/* Medical History */}
                        <section className="mb-8">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-900">
                              Medical History
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Patient history and previously recorded medical
                              information.
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            {patient.medicalHistory ? (
                              <div className="flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
                                  🩺
                                </div>

                                <p className="whitespace-pre-wrap leading-7 text-slate-600">
                                  {patient.medicalHistory}
                                </p>
                              </div>
                            ) : (
                              <div className="py-4 text-center">
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg">
                                  🩺
                                </div>

                                <h4 className="mt-3 font-semibold text-slate-900">
                                  No medical history recorded
                                </h4>

                                <p className="mt-1 text-sm text-slate-500">
                                  Medical history can be added when updating
                                  this patient.
                                </p>
                              </div>
                            )}
                          </div>
                        </section>

                        {/* Tests */}
                        <section>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-lg">🧪</span>

                            <h5 className="font-semibold text-slate-900">
                              Tests / Investigations
                            </h5>
                          </div>

                          {Array.isArray(record.aiSummary.tests) &&
                          record.aiSummary.tests.filter(
                            (test) =>
                              test &&
                              typeof test === "object" &&
                              String(test.name || "").trim() &&
                              !["test", "tests", "result", "results"].includes(
                                String(test.name || "")
                                  .trim()
                                  .toLowerCase(),
                              ),
                          ).length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-2">
                              {record.aiSummary.tests.map(renderTest)}
                            </div>
                          ) : (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                              <p className="text-sm text-slate-400">
                                No test results were identified in the report.
                              </p>
                            </div>
                          )}
                        </section>

                        {/* Follow Up */}
                        <section>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-lg">📅</span>

                            <h5 className="font-semibold text-slate-900">
                              Follow-up / Recommendations
                            </h5>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                            {renderList(record.aiSummary.followUp)}
                          </div>
                        </section>

                        {/* Important Notes */}
                        <section>
                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-lg">⚠️</span>

                            <h5 className="font-semibold text-slate-900">
                              Important Notes
                            </h5>
                          </div>

                          <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                            {renderList(record.aiSummary.importantNotes)}
                          </div>
                        </section>

                        {/* Disclaimer */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-xs leading-5 text-slate-500">
                            AI-generated summary based only on the uploaded
                            medical document. It is intended to assist with
                            reviewing the record and should not replace
                            professional medical judgment.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Upload CTA */}
        {records.length > 0 && (
          <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Add another medical report
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Upload another PDF or TXT document to this patient's record.
                </p>
              </div>

              <Link
                to={`/patients/${id}/upload`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Upload Report
              </Link>
            </div>
          </section>
        )}
        {/* Full Text Modal */}
        {selectedRecord && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
            onClick={() => setSelectedRecord(null)}
          >
            <div
              className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                <div className="min-w-0 pr-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
                      {getFileIcon(selectedRecord.fileName)}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-slate-900">
                        {selectedRecord.fileName}
                      </h2>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {formatRecordType(selectedRecord.recordType)}
                        </span>

                        <span className="text-xs text-slate-400">
                          {selectedRecord.wordCount || 0} words
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto px-6 py-6">
                {selectedRecord.extractedText ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {selectedRecord.extractedText}
                    </p>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                      📄
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      No extracted text available
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Text could not be displayed for this medical record.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                <div className="text-xs text-slate-400">
                  Uploaded {formatDate(selectedRecord.createdAt)}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PatientDetails;
