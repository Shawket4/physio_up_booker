import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  CircularProgress,
  Alert,
  Button,
  Box,
  Chip,
  Container,
  Paper,
  IconButton,
  useTheme,
  Fade,
  Slide
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import ContactBox from "../components/ContactBox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import EventIcon from "@mui/icons-material/Event";
import { green, blue, orange } from "@mui/material/colors";
import Logo from "../components/Logo";
const ServerIP = process.env.REACT_APP_SERVER_IP;

const AppointmentsScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    const patientId = Cookies.get("patient_id");

    if (!patientId) {
      navigate("/");
      return;
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(`${ServerIP}/api/FetchAppointmentsByPatientID`, {
          id: parseInt(patientId),
        });

        // Add a small delay to make the loading experience smoother
        setTimeout(() => {
          setAppointments(response.data.appointments);
          setAppointmentRequests(response.data.requests);
          setLoading(false);
          setLoadingComplete(true);
        }, 600);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments. Please try again later.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleGoBack = () => {
    navigate("/", { state: { fromAppointments: true } });
  };

  const formatAppointmentDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const AppointmentCard = ({ appointment, isRequest }) => {
    const date = new Date(appointment.date_time);
    const isPast = date < new Date();
    
    return (
      <Slide in={loadingComplete} direction="up" timeout={(appointment.id % 3 + 1) * 200}>
        <Card 
          elevation={2} 
          sx={{ 
            mb: 2, 
            borderRadius: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            backgroundColor: isPast && appointment.is_completed ? '#f9fff9' : 'white',
            borderLeft: '4px solid',
            borderLeftColor: isRequest 
              ? orange[500] 
              : (appointment.is_completed ? green[500] : blue[500]),
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ 
                  color: isRequest ? orange[500] : (appointment.is_completed ? green[500] : blue[500]),
                  mr: 1 
                }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {formatAppointmentDate(appointment.date_time)}
                </Typography>
              </Box>
              {!isRequest && (
                <Chip 
                  size="small"
                  label={appointment.is_completed ? "Completed" : "Scheduled"} 
                  color={appointment.is_completed ? "success" : "primary"}
                  icon={appointment.is_completed ? <CheckCircleIcon /> : <CalendarTodayIcon />}
                />
              )}
              {isRequest && (
                <Chip 
                  size="small"
                  label="Pending"
                  color="warning"
                  icon={<HourglassEmptyIcon />}
                />
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
              <PersonIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Therapist: <Box component="span" sx={{ fontWeight: 500, color: 'text.primary' }}>{appointment.therapist_name}</Box>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Slide>
    );
  };

  const EmptyState = ({ message, isRequest }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        backgroundColor: isRequest ? orange[50] : blue[50],
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {isRequest ? (
        <HourglassEmptyIcon sx={{ color: orange[300], fontSize: 40, mb: 1 }} />
      ) : (
        <CalendarTodayIcon sx={{ color: blue[300], fontSize: 40, mb: 1 }} />
      )}
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ backgroundColor: "#f5f7ff", minHeight: "100vh", pb: 4 }}>
      <AppBar position="static" sx={{ 
        backgroundColor: "#011627",
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleGoBack}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Your Appointments
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3
        }}>
          <Logo />
        </Box>

        {error && (
          <Fade in={Boolean(error)}>
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }} 
              onClose={() => setError(null)}
              variant="filled"
            >
              {error}
            </Alert>
          </Fade>
        )}

        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            py: 8 
          }}>
            <CircularProgress size={50} thickness={4} />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Loading your appointments...
            </Typography>
          </Box>
        ) : (
          <Fade in={!loading} timeout={500}>
            <Box>
              <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: blue[600], 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Confirmed Appointments
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} isRequest={false} />
                    ))
                  ) : (
                    <EmptyState message="No confirmed appointments found." isRequest={false} />
                  )}
                </Box>
              </Paper>

              <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: orange[600], 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <HourglassEmptyIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Pending Requests
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {appointmentRequests.length > 0 ? (
                    appointmentRequests.map((request) => (
                      <AppointmentCard key={request.id} appointment={request} isRequest={true} />
                    ))
                  ) : (
                    <EmptyState message="No pending appointment requests." isRequest={true} />
                  )}
                </Box>
              </Paper>

              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleGoBack}
                sx={{ 
                  borderRadius: 2, 
                  py: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: '0 6px 14px rgba(0,0,0,0.2)',
                  }
                }}
                startIcon={<AddIcon />}
              >
                Book a New Appointment
              </Button>
            </Box>
          </Fade>
        )}
      </Container>
      
      <Box sx={{ mt: 4 }}>
        <ContactBox />
      </Box>
    </Box>
  );
};

export default AppointmentsScreen;