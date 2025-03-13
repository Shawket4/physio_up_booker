import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import ContactBox from "../components/ContactBox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { green } from "@mui/material/colors";
import Logo from "../components/Logo";
const ServerIP = process.env.REACT_APP_SERVER_IP;

const AppointmentsScreen = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const patientId = Cookies.get("patient_id");

    if (!patientId) {
      // If no patient_id cookie, redirect to the home page
      navigate("/");
      return;
    }

    // Fetch appointments and appointment requests
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(`${ServerIP}/api/FetchAppointmentsByPatientID`, {
          id: parseInt(patientId),
        });

        setAppointments(response.data.appointments);
        setAppointmentRequests(response.data.requests);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleGoBack = () => {
    navigate("/", { state: { fromAppointments: true } }); // Pass state
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#011627" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Your Appointments
          </Typography>
        </Toolbar>
      </AppBar>

      <Logo/>

      <Card sx={{ margin: 2, padding: 2, backgroundColor: "#F1F3FF" }}>
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Grid container justifyContent="center" sx={{ padding: 3 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Confirmed Appointments
              </Typography>
              {appointments.length > 0 ? (
                <List>
                  {appointments.map((appointment) => (
                    <ListItem key={appointment.id}>
                      <ListItemText
                        primary={`Date: ${appointment.date_time}`}
                        secondary={`Therapist: ${appointment.therapist_name}`}
                      />
                      {appointment.is_completed && (
            <ListItemIcon>
              <CheckCircleIcon sx={{ color: green[500] }} /> {/* Green checkmark icon */}
            </ListItemIcon>
          )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No confirmed appointments found.
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Appointment Requests
              </Typography>
              {appointmentRequests.length > 0 ? (
                <List>
                  {appointmentRequests.map((request) => (
                    <ListItem key={request.id}>
                      <ListItemText
                        primary={`Date: ${request.date_time}`}
                        secondary={`Therapist: ${request.therapist_name}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No appointment requests found.
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleGoBack}>
                Book a New Appointment
              </Button>
            </Grid>
          </Grid>
        )}
      </Card>
      <ContactBox/>
    </>
  );
};

export default AppointmentsScreen;