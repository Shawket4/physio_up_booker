import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MakeAppointmentScreen from "./screens/MakeAppointmentScreen";
import AppointmentSuccessScreen from "./screens/AppointmentSuccessScreen";
import AppointmentsScreen from "./screens/AppointmentsScreen";
import { Support } from "@mui/icons-material";
import SupportScreen from "./screens/support_screen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MakeAppointmentScreen />} />
        <Route path="/appointment-success" element={<AppointmentSuccessScreen />} />
        <Route path="/appointments" element={<AppointmentsScreen />} />
        <Route path="/support" element={<SupportScreen />} />
      </Routes>
    </Router>
  );
}

export default App;