import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/patients");

        setPatientCount(response.data.count);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setError("Unable to load patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
              AI-powered clinical record analysis
            </p>
          </div>

          <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700">
            Logout
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="mt-2 text-slate-400">
            Overview of your mental health records and AI summaries.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Patients */}
          <Link
  to="/patients"
  className="block rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-600 hover:bg-slate-800"
>
  <p className="text-sm text-slate-400">
    Total Patients
  </p>

  <p className="mt-2 text-3xl font-bold">
    {loading ? "..." : patientCount}
  </p>

  <p className="mt-2 text-xs text-slate-500">
    View all patients →
  </p>
</Link>

          {/* Records */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Medical Records
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>

          {/* Summaries */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              AI Summaries
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>

          {/* Processing */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Avg. Processing Time
            </p>

            <p className="mt-2 text-3xl font-bold">
              —
            </p>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-8">

          <h3 className="mb-4 text-xl font-semibold">
            Quick Actions
          </h3>

          <div className="grid gap-4 md:grid-cols-3">

            <Link
  to="/patients"
  className="block rounded-xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-slate-600 hover:bg-slate-800"
>
  <h4 className="font-semibold">
    Manage Patients
  </h4>

  <p className="mt-2 text-sm text-slate-400">
    View and manage patient records.
  </p>
</Link>

            <button className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-slate-600 hover:bg-slate-800">
              <h4 className="font-semibold">
                Upload Record
              </h4>

              <p className="mt-2 text-sm text-slate-400">
                Upload a clinical or mental health record.
              </p>
            </button>

            <button className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-slate-600 hover:bg-slate-800">
              <h4 className="font-semibold">
                View Evaluations
              </h4>

              <p className="mt-2 text-sm text-slate-400">
                Analyze summary quality and performance.
              </p>
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;