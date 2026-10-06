import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/navbar";

function UploadReport() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/patients");

        setPatients(response.data.patients || []);
      } catch (err) {
        console.error("Failed to fetch patients:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load patients."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      patient.name?.toLowerCase().includes(query) ||
      patient.patientId?.toLowerCase().includes(query) ||
      patient.contact?.toLowerCase().includes(query)
    );
  });

  const getInitials = (name) => {
    if (!name) return "P";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <section className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Medical Records
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Upload Medical Report
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Select the patient whose medical report you want to
            upload.
          </p>
        </section>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="patientSearch"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search Patient
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              id="patientSearch"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient name, ID or contact..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading patients...
            </p>
          </div>
        )}

        {/* No patients */}
        {!loading && !error && patients.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              👥
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No patients found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Create a patient profile before uploading a medical
              report.
            </p>

            <Link
              to="/patients/add"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Add Patient
            </Link>
          </div>
        )}

        {/* Search results */}
        {!loading &&
          !error &&
          patients.length > 0 &&
          filteredPatients.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mb-4 text-3xl">🔍</div>

              <h2 className="font-semibold text-slate-900">
                No matching patients
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try searching with a different name or patient ID.
              </p>
            </div>
          )}

        {/* Patient cards */}
        {!loading &&
          !error &&
          filteredPatients.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {filteredPatients.length}{" "}
                  {filteredPatients.length === 1
                    ? "patient"
                    : "patients"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient._id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                          {getInitials(patient.name)}
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate font-semibold text-slate-900">
                            {patient.name}
                          </h2>

                          <p className="mt-1 text-xs text-slate-400">
                            {patient.patientId}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                        {patient.gender}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400">
                          Age
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {patient.age} years
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">
                          Contact
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-slate-700">
                          {patient.contact || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/patients/${patient._id}/upload`)
                      }
                      className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Upload Report →
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
      </main>
    </div>
  );
}

export default UploadReport;