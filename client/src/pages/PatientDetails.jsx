import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true);

  const [error, setError] = useState("");
  const [recordsError, setRecordsError] = useState("");

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

  const fetchRecords = async () => {
    try {
      const response = await api.get(
        `/medical-records/patient/${id}`
      );

      setRecords(response.data.records);
    } catch (err) {
      console.error("Failed to fetch medical records:", err);
      setRecordsError("Unable to load medical records.");
    } finally {
      setRecordsLoading(false);
    }
  };
const handleDeleteRecord = async (recordId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this medical record?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await api.delete(`/medical-records/${recordId}`);

    setRecords((prevRecords) =>
      prevRecords.filter((record) => record._id !== recordId)
    );
  } catch (err) {
    console.error("Failed to delete medical record:", err);

    alert("Failed to delete the medical record. Please try again.");
  }
};

  useEffect(() => {
    fetchPatient();
    fetchRecords();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading patient...
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">

          <div className="rounded-xl border border-red-800 bg-red-950 p-6 text-red-300">
            {error || "Patient not found."}
          </div>

          <Link
            to="/patients"
            className="mt-6 inline-block rounded-lg bg-slate-800 px-5 py-3 text-sm hover:bg-slate-700"
          >
            ← Back to Patients
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold">
              Mental Health Summarizer
            </h1>

            <p className="text-sm text-slate-400">
              Patient Details
            </p>
          </div>

          <Link
            to="/patients"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
          >
            ← Patients
          </Link>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Patient Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <div className="flex items-center gap-3">

              <h2 className="text-3xl font-bold">
                {patient.name}
              </h2>

              <span className="rounded-full bg-blue-950 px-3 py-1 text-xs font-medium text-blue-300">
                {patient.patientId}
              </span>

            </div>

            <p className="mt-2 text-slate-400">
              Patient profile and medical records
            </p>

          </div>

          <Link
            to={`/patients/${id}/upload`}
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-medium hover:bg-blue-500"
          >
            + Upload Medical Record
          </Link>

        </div>

        {/* Patient Information */}
        <section className="mb-8">

          <h3 className="mb-4 text-xl font-semibold">
            Patient Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Age
              </p>

              <p className="mt-2 text-lg font-semibold">
                {patient.age} years
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Gender
              </p>

              <p className="mt-2 text-lg font-semibold">
                {patient.gender}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Contact
              </p>

              <p className="mt-2 break-words text-lg font-semibold">
                {patient.contact || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">
                Patient ID
              </p>

              <p className="mt-2 text-lg font-semibold">
                {patient.patientId}
              </p>
            </div>

          </div>

        </section>

        {/* Medical History */}
        <section className="mb-8">

          <h3 className="mb-4 text-xl font-semibold">
            Medical History
          </h3>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

            {patient.medicalHistory ? (
              <p className="whitespace-pre-wrap leading-7 text-slate-300">
                {patient.medicalHistory}
              </p>
            ) : (
              <p className="text-slate-500">
                No medical history has been added.
              </p>
            )}

          </div>

        </section>

        {/* Medical Records */}
        <section>

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h3 className="text-xl font-semibold">
                Medical Records
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {records.length} record{records.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>

          {recordsError && (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-950 p-4 text-red-300">
              {recordsError}
            </div>
          )}

          {recordsLoading ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading medical records...
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl">
                📄
              </div>

              <h4 className="text-lg font-semibold">
                No medical records yet
              </h4>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Upload a clinical note, psychiatric report, therapy
                note, prescription or other medical document to begin.
              </p>

              <Link
                to={`/patients/${id}/upload`}
                className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
              >
                Upload Medical Record
              </Link>

            </div>
          ) : (
            <div className="space-y-4">

              {records.map((record) => (
                <div
                  key={record._id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                >

                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                    <div className="flex gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl">
                        📄
                      </div>

                      <div>

                        <h4 className="font-semibold">
                          {record.fileName}
                        </h4>

                        <div className="mt-2 flex flex-wrap gap-2">

                          <span className="rounded-full bg-blue-950 px-3 py-1 text-xs text-blue-300">
                            {record.recordType.replaceAll("_", " ")}
                          </span>

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                            {record.wordCount} words
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="text-sm text-slate-500">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>

                  </div>

                  {/* Extracted Text Preview */}
                  <div className="mt-5 border-t border-slate-800 pt-5">

                    <p className="mb-2 text-sm font-medium text-slate-400">
                      Extracted Text Preview
                    </p>

                    <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                      {record.extractedText || "No extracted text available."}
                    </p>

                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap gap-3">

  <button
    className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
  >
    View Full Text
  </button>

  <button
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
  >
    Generate AI Summary
  </button>

  <button
    onClick={() => handleDeleteRecord(record._id)}
    className="rounded-lg bg-red-950 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-900"
  >
    Delete
  </button>

</div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default PatientDetails;