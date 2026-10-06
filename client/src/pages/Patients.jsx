import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/navbar";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/patients");
        setPatients(response.data.patients);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setError("Unable to load patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) => {
      return (
        patient.name?.toLowerCase().includes(query) ||
        patient.patientId?.toLowerCase().includes(query) ||
        patient.gender?.toLowerCase().includes(query) ||
        patient.contact?.toLowerCase().includes(query)
      );
    });
  }, [patients, search]);

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Page Header */}
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>
              <p className="mb-2 text-sm font-medium text-blue-600">
                Patient Management
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Patients
              </h2>

              <p className="mt-2 text-slate-500">
                Manage patient profiles and access their medical records.
              </p>
            </div>

            <Link
              to="/patients/add"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            >
              + Add Patient
            </Link>

          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Search and Stats */}
        <section className="mb-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID, gender or contact..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Count */}
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredPatients.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {patients.length}
              </span>{" "}
              patients
            </div>

          </div>
        </section>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="text-sm font-medium text-slate-600">
              Loading patients...
            </p>
          </div>
        ) : patients.length === 0 ? (

          /* No Patients */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              👥
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              No patients yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first patient profile to start managing medical
              information and records.
            </p>

            <Link
              to="/patients/add"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Add First Patient
            </Link>

          </div>

        ) : filteredPatients.length === 0 ? (

          /* No Search Results */
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl">
              🔍
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              No patients found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try searching with a different name, ID or contact.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear search
            </button>

          </div>

        ) : (

          /* Patients Table */
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Patient ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Age
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Gender
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredPatients.map((patient) => (

                    <tr
                      key={patient._id}
                      className="group transition hover:bg-slate-50"
                    >

                      {/* Patient */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                            {getInitials(patient.name)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {patient.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Patient profile
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* ID */}
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                          {patient.patientId}
                        </span>
                      </td>

                      {/* Age */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {patient.age} years
                      </td>

                      {/* Gender */}
                      <td className="px-6 py-4">

                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                          {patient.gender}
                        </span>

                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {patient.contact || "Not provided"}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">

                        <Link
                          to={`/patients/${patient._id}`}
                          className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                          <span className="ml-1 transition group-hover:translate-x-0.5">
                            →
                          </span>
                        </Link>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </main>
    </div>
  );
}

export default Patients;