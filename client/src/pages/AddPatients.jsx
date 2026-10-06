import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/navbar";

function AddPatient() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    medicalHistory: "",
  });

  const [file, setFile] = useState(null);
  const [recordType, setRecordType] = useState("other");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "text/plain",
    ];

    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF and TXT files are allowed.");
      setFile(null);
      e.target.value = "";
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("Medical report must be smaller than 10 MB.");
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.age ||
      !formData.gender
    ) {
      setError("Name, age and gender are required.");
      return;
    }

    try {
      setLoading(true);

      // --------------------------------
      // 1. Create the patient
      // --------------------------------
      const patientResponse = await api.post(
        "/patients",
        {
          name: formData.name.trim(),
          age: Number(formData.age),
          gender: formData.gender,
          contact: formData.contact.trim(),
          medicalHistory: formData.medicalHistory.trim(),
        }
      );

      const createdPatient =
        patientResponse.data.patient;

      // --------------------------------
      // 2. Upload report if selected
      // --------------------------------
      if (file && createdPatient?._id) {
        const uploadData = new FormData();

        uploadData.append("file", file);
        uploadData.append(
          "patientId",
          createdPatient._id
        );
        uploadData.append(
          "recordType",
          recordType
        );

        await api.post(
          "/medical-records/upload",
          uploadData
        );
      }

      // --------------------------------
      // 3. Go to patient profile
      // --------------------------------
      navigate(`/patients/${createdPatient._id}`);
    } catch (err) {
      console.error(
        "Failed to create patient:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to create patient. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Back */}
        <Link
          to="/patients"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          ← Back to Patients
        </Link>

        {/* Heading */}
        <section className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Patient Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Add New Patient
          </h1>

          <p className="mt-2 text-slate-500">
            Create a patient profile and optionally upload their
            first medical report.
          </p>
        </section>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Patient Information */}
          <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-5 md:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                👤
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Patient Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the basic details of the patient.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 p-6 md:p-8">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <span>⚠️</span>

                <p>{error}</p>
              </div>
            )}

            {/* Basic fields */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter patient's full name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="age"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Age <span className="text-red-500">*</span>
                </label>

                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  max="150"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Gender{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">Male</option>

                  <option value="Female">Female</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Contact */}
              <div className="md:col-span-2">
                <label
                  htmlFor="contact"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Contact
                </label>

                <input
                  id="contact"
                  name="contact"
                  type="text"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Phone number or other contact information"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Medical History */}
              <div className="md:col-span-2">
                <label
                  htmlFor="medicalHistory"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Medical History
                </label>

                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  rows="5"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  placeholder="Add any relevant medical history, conditions, allergies, previous treatments, etc."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            {/* First Medical Report */}
            <div className="border-t border-slate-100 pt-8">
              <div className="mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
                    📄
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Medical Report
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      You can upload the patient's
                      medical document now.
                    </p>
                  </div>
                </div>
              </div>

              {!file ? (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    📤
                  </div>

                  <p className="font-semibold text-slate-800">
                    Upload medical report
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    PDF or TXT files only
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Maximum file size: 10 MB
                  </p>

                  <span className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-blue-700">
                    Choose File
                  </span>
                </button>
              ) : (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                        {file.type ===
                        "application/pdf"
                          ? "📕"
                          : "📄"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                    >
                      Remove
                    </button>
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

              {/* Record type */}
              {file && (
                <div className="mt-5">
                  <label
                    htmlFor="recordType"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Record Type
                  </label>

                  <select
                    id="recordType"
                    value={recordType}
                    onChange={(e) =>
                      setRecordType(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
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
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Supported formats: PDF and TXT. Maximum file size:
                10 MB.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
            <Link
              to="/patients"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {file
                    ? "Creating Patient & Uploading..."
                    : "Creating Patient..."}
                </>
              ) : (
                <>
                  {file
                    ? "Create Patient & Upload Report"
                    : "Create Patient"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Privacy note */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-sm">🔒</span>

          <p className="text-xs leading-5 text-slate-500">
            Medical information is sensitive. Only upload documents
            that you are authorized to handle and keep patient
            information secure.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AddPatient;