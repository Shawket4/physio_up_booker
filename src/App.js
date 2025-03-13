import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MakeAppointmentScreen from "./screens/MakeAppointmentScreen";
import AppointmentSuccessScreen from "./screens/AppointmentSuccessScreen";
import AppointmentsScreen from "./screens/AppointmentsScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MakeAppointmentScreen />} />
        <Route path="/appointment-success" element={<AppointmentSuccessScreen />} />
        <Route path="/appointments" element={<AppointmentsScreen />} />
      </Routes>
    </Router>
  );
}

export default App;