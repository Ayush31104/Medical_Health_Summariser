import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/navbar";

function Dashboard() {
  const [patientCount, setPatientCount] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  const [summaryCount, setSummaryCount] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [recentRecords, setRecentRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const patientsResponse = await api.get("/patients");

        const patients = patientsResponse.data.patients || [];

        setPatientCount(patients.length);

        const recordResponses = await Promise.all(
          patients.map((patient) =>
            api.get(`/medical-records/patient/${patient._id}`),
          ),
        );

        const allRecords = recordResponses.flatMap(
    (response, index) =>
        (response.data.records || []).map((record) => ({
            ...record,
            patientName: patients[index]?.name || "Unknown Patient",
        }))
);

        setRecordCount(allRecords.length);

        const summaries = allRecords.filter(
          (record) =>
            record.aiSummary &&
            (typeof record.aiSummary === "string"
              ? record.aiSummary.trim().length > 0
              : Object.keys(record.aiSummary).length > 0),
        );

        setSummaryCount(summaries.length);

        const processedRecords = allRecords.filter(
          (record) =>
            record.extractedText && record.extractedText.trim().length > 0,
        );

        setProcessedCount(processedRecords.length);

const sortedRecords = [...allRecords].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

setRecentRecords(sortedRecords.slice(0, 5));

} catch (err) {
    console.error("Failed to fetch dashboard data:", err);

    setError(
        err.response?.data?.message || "Unable to load dashboard data."
    );
}
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Reports Processed",
      value: loading ? "—" : processedCount,
      icon: "📄",
      color: "blue",
    },
    {
      label: "AI Summaries",
      value: loading ? "—" : summaryCount,
      icon: "✨",
      color: "violet",
    },
    {
      label: "Saved Reports",
      value: loading ? "—" : recordCount,
      icon: "🗂️",
      color: "emerald",
    },
    {
      label: "Patients",
      value: loading ? "—" : patientCount,
      icon: "👥",
      color: "amber",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* AI Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/70 px-8 py-14 shadow-sm md:px-14">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-md">
              ✨
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600">
              AI-Powered Medical Report Summarizer
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Understand Your Medical Reports
              <span className="block text-blue-600">in Seconds</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Upload your medical report and let MediClarity extract the
              important information and turn it into a clear, structured
              AI-powered summary.
            </p>

            {/* Upload CTA */}
            <div className="mx-auto mt-9 max-w-2xl">
              <Link
                to="/upload-report"
                className="group block rounded-2xl border-2 border-dashed border-blue-200 bg-white/80 p-8 shadow-sm transition hover:border-blue-400 hover:bg-white hover:shadow-md"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:scale-105">
                  📄
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  Upload Your Medical Report
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Drag & drop your report or choose a file to get started.
                </p>

                <span className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition group-hover:bg-blue-700">
                  Choose Medical Report
                  <span className="ml-2">→</span>
                </span>

                <p className="mt-4 text-xs text-slate-400">
                  PDF and TXT medical documents supported
                </p>
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span>✓ Extract medical information</span>
              <span>✓ Identify tests & results</span>
              <span>✓ Generate structured summary</span>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* How It Works */}
        <section className="mt-12">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Simple Process
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              From Report to Understanding
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              MediClarity handles the complicated part for you.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                📤
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">1. Upload</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Upload your medical report securely to MediClarity.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-xl">
                🧠
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                2. AI Analyzes
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                AI reads the document and identifies important medical
                information.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                ✨
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                3. Understand
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Get a structured summary containing the key information from
                your report.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Stats */}
        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Your MediClarity Workspace
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your saved reports and AI activity.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colorClasses[stat.color]}`}
                >
                  {stat.icon}
                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Secondary Actions */}
        <section className="mt-12">
          <div className="grid gap-5 md:grid-cols-2">
            <Link
              to="/patients"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                  👥
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Patient Records
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage patients and access their saved medical reports.
                  </p>
                </div>
              </div>

              <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
                View patients →
              </span>
            </Link>

            <Link
              to="/upload-report"
              className="group rounded-2xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                  ✨
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Analyze Another Report
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    Upload another medical report and generate a new AI summary.
                  </p>
                </div>
              </div>

              <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
                Upload report →
              </span>
            </Link>
          </div>
        </section>

                {/* Recent Medical Reports */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Medical Reports
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Recently uploaded medical documents.
              </p>
            </div>

            <Link
              to="/patients"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all patients →
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {recentRecords.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  📄
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No medical reports yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a medical report to see it here.
                </p>

                <Link
                  to="/upload-report"
                  className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Upload Report
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentRecords.map((record) => {
                  const patientId =
                    typeof record.patientId === "object"
                      ? record.patientId._id
                      : record.patientId;

                  return (
                    <div
                      key={record._id}
                      className="flex items-center justify-between gap-6 px-6 py-5 transition hover:bg-slate-50"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg">
                          📄
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-900">
                            {record.fileName || "Medical Report"}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                            <span>
                              {record.patientName || "Unknown Patient"}
                            </span>

                            <span className="text-slate-300">
                              •
                            </span>

                            <span>
                              {record.recordType
                                ?.replaceAll("_", " ")
                                .replace(/\b\w/g, (char) =>
                                  char.toUpperCase()
                                ) || "Other"}
                            </span>

                            <span className="text-slate-300">
                              •
                            </span>

                            <span>
                              {record.createdAt
                                ? new Date(
                                    record.createdAt
                                  ).toLocaleDateString()
                                : "Unknown date"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        {record.aiSummary ? (
                          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
                            AI Summarized
                          </span>
                        ) : (
                          <span className="hidden rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 sm:inline-flex">
                            Not Summarized
                          </span>
                        )}

                        <Link
                          to={`/patients/${patientId}`}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Privacy */}
        <p className="mt-10 text-center text-xs leading-5 text-slate-400">
          MediClarity is a project prototype. Medical information should always
          be handled securely and in accordance with applicable privacy and
          healthcare requirements.
        </p>
      </main>
    </div>
  );
}

export default Dashboard;
