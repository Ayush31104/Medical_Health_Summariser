import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
              Patient Management
            </p>
          </div>

          <Link
            to="/"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
          >
            Dashboard
          </Link>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Page heading */}
        <div className="mb-8 flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold">
              Patients
            </h2>

            <p className="mt-2 text-slate-400">
              Manage patient records and medical information.
            </p>
          </div>

          <Link
  to="/patients/add"
  className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
>
  + Add Patient
</Link>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Loading patients...
          </div>
        ) : patients.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No patients found.
            </p>
          </div>
        ) : (

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

            <table className="w-full">

              <thead className="border-b border-slate-800 bg-slate-800/50">

                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Patient ID
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Age
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Gender
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {patients.map((patient) => (

                  <tr
                    key={patient._id}
                    className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40"
                  >

                    <td className="px-6 py-4 font-medium">
                      {patient.patientId}
                    </td>

                    <td className="px-6 py-4">
                      {patient.name}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {patient.age}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {patient.gender}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {patient.contact || "—"}
                    </td>

                    <td className="px-6 py-4">

                      <Link
                        to={`/patients/${patient._id}`}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
                      >
                        View
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </main>

    </div>
  );
}

export default Patients;