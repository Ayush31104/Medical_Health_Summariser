import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import AddPatient from "./pages/AddPatients";
import PatientDetails from "./pages/PatientDetails";
import UploadMedicalReport from "./pages/UploadMedicalReport";
import UploadReport from "./pages/UploadReport";
import EditPatient from "./pages/EditPatient";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/add" element={<AddPatient />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
        <Route path="/patients/:id/upload" element={<UploadMedicalReport />} />
        <Route path="/upload-report" element={<UploadReport />} />
        <Route path="/patients/:id/edit" element={<EditPatient />} />
        <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
