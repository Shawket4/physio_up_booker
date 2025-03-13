import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { format, parse, isEqual } from "date-fns";
import Cookies from "js-cookie";
import Logo from "../components/Logo";
import ContactBox from "../components/ContactBox";


const ServerIP = process.env.REACT_APP_SERVER_IP;

const MakeAppointmentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromAppointments = location.state?.fromAppointments;

  const [timeBlocks, setTimeBlocks] = useState([]);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isExisting, setIsExisting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPatientTypeDialog, setShowPatientTypeDialog] = useState(true);
  const [showTherapistDialog, setShowTherapistDialog] = useState(false);
  const [availableTherapists, setAvailableTherapists] = useState([]);
  const [showPhoneNumberDialog, setShowPhoneNumberDialog] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");

  useEffect(() => {
    const patientId = Cookies.get("patient_id");
    if (fromAppointments) {
      return;
    }

    if (patientId) {
      navigate("/appointments");
    }
  }, [navigate, fromAppointments]);

  useEffect(() => {
    fetchTherapists();
  }, []);

  useEffect(() => {
    if (therapists.length > 0) {
      generateTimeBlocks();
    }
  }, [selectedDate, therapists]);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${ServerIP}/api/GetTherapists`);
      setTherapists(response.data);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      setError("Failed to load therapists. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const generateTimeBlocks = () => {
    const blocks = [];
    for (let hour = 11; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        const blockDateTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          hour,
          minute
        );

        const availableTherapistsForBlock = therapists.filter(therapist => {
          const bookedTimes = therapist.schedule?.time_blocks || [];
          const isBooked = bookedTimes.some(bookedBlock => {
            const bookedTime = parse(bookedBlock.date, "yyyy/MM/dd & h:mm a", new Date());
            return (
              bookedTime.getFullYear() === blockDateTime.getFullYear() &&
              bookedTime.getMonth() === blockDateTime.getMonth() &&
              bookedTime.getDate() === blockDateTime.getDate() &&
              bookedTime.getHours() === blockDateTime.getHours() &&
              bookedTime.getMinutes() === blockDateTime.getMinutes()
            );
          });
          return !isBooked;
        });

        blocks.push({
          dateTime: blockDateTime,
          isAvailable: availableTherapistsForBlock.length > 0,
          availableTherapists: availableTherapistsForBlock
        });
      }
    }
    setTimeBlocks(blocks);
    setSelectedTimeBlock(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeBlockClick = (block) => {
    if (!block.isAvailable) {
      return;
    }
    setSelectedTimeBlock(block);
    setAvailableTherapists(block.availableTherapists);
    setShowTherapistDialog(true);
  };

  const handleTherapistSelect = (therapist) => {
    setSelectedTherapist(therapist);
    setShowTherapistDialog(false);
  };

  const handleBookAppointment = async () => {
    if (!selectedTimeBlock || !selectedTherapist) {
      setError("Please select a time and therapist");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const finalDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTimeBlock.dateTime.getHours(),
        selectedTimeBlock.dateTime.getMinutes()
      );

      const data = {
        date_time: format(finalDateTime, "yyyy/MM/dd & h:mm a"),
        patient_name: isExisting ? "" : name,
        therapist_id: selectedTherapist.ID,
        phone_number: phoneNumber,
        is_existing: isExisting,
      };

      const response = await axios.post(`${ServerIP}/api/RequestAppointment`, data, {
        withCredentials: true,
      });

      if (response.data.message === "Requested Successfully") {
        navigate('/appointment-success', {
          state: {
            appointmentData: {
              date: format(finalDateTime, "EEEE, MMMM d, yyyy"),
              time: format(finalDateTime, "h:mm a"),
              therapistName: selectedTherapist.name,
              patientName: isExisting ? phoneNumber : name,
            }
          }
        });
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError(
        error.response?.data?.error ||
        "Error booking appointment. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!selectedTimeBlock || !selectedTherapist) {
      return false;
    }
    if (isExisting) {
      return phoneNumber.trim() !== "";
    } else {
      return name.trim() !== "" && phoneNumber.trim() !== "";
    }
  };

  const handleViewAppointments = async () => {
    if (!tempPhoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${ServerIP}/api/GetPatientIdByPhone`, {
        phone_number: tempPhoneNumber,
      });

      const patientId = response.data.patient_id;
      if (patientId) {
        Cookies.set("patient_id", patientId, { expires: 14 });
        navigate("/appointments");
      } else {
        setError("No patient found with this phone number");
      }
    } catch (error) {
      console.error("Error fetching patient ID:", error);
      setError("Failed to fetch patient ID. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* Logo at the top */}
      <AppBar position="static" sx={{ backgroundColor: "#011627" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Request Appointment
          </Typography>
        </Toolbar>
      </AppBar>
      <Logo/>
      {/* Dialog for selecting new/existing patient or viewing appointments */}
      <Dialog open={showPatientTypeDialog} onClose={() => setShowPatientTypeDialog(false)}>
        <DialogTitle>Select An Option</DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setIsExisting(false);
              setShowPatientTypeDialog(false);
              setPhoneNumber("");
            }}
            sx={{ marginBottom: 2 }}
          >
            New Patient
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              const phoneNumber = Cookies.get("phone_number");
              if (phoneNumber) {
                setPhoneNumber(phoneNumber);
              }
              setIsExisting(true);
              setShowPatientTypeDialog(false);
            }}
            sx={{ marginBottom: 2 }}
          >
            Existing Patient
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setShowPatientTypeDialog(false);
              setShowPhoneNumberDialog(true);
            }}
          >
            View Appointments
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog for entering phone number to view appointments */}
      <Dialog open={showPhoneNumberDialog} onClose={() => setShowPhoneNumberDialog(false)}>
        <DialogTitle>Enter Your Phone Number</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Phone Number"
            value={tempPhoneNumber}
            onChange={(e) => setTempPhoneNumber(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleViewAppointments}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "View Appointments"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog for selecting therapist */}
      <Dialog open={showTherapistDialog} onClose={() => setShowTherapistDialog(false)}>
        <DialogTitle>Select Therapist</DialogTitle>
        <DialogContent>
          <List>
            {availableTherapists.length > 0 ? (
              availableTherapists.map((therapist) => (
                <ListItem
                  key={therapist.ID}
                  button
                  onClick={() => handleTherapistSelect(therapist)}
                >
                  <ListItemText primary={therapist.name} />
                </ListItem>
              ))
            ) : (
              <Typography>No available therapists for this time slot.</Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>

      {/* Main form for booking appointments */}
      {!showPatientTypeDialog && !showPhoneNumberDialog && (
        <Card sx={{ margin: 2, padding: 2, backgroundColor: "#F1F3FF" }}>
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
                maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                sx={{ width: '100%' }}
                format="dd/MM/yyyy"
              />
            </Grid>

            <Grid item xs={12}>
              {selectedTherapist ? (
                <Typography variant="subtitle1">
                  Selected Therapist: <strong>{selectedTherapist.name}</strong>
                </Typography>
              ) : (
                <Typography variant="subtitle1" color="text.secondary">
                  Please select a time slot and therapist
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Available Time Slots:
              </Typography>
              {loading ? (
                <Grid container justifyContent="center" sx={{ padding: 3 }}>
                  <CircularProgress />
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  {timeBlocks.map((block, index) => (
                    <Grid item key={index} xs={4}>
                      <Card
                        sx={{
                          backgroundColor:
                            selectedTimeBlock?.dateTime && isEqual(selectedTimeBlock.dateTime, block.dateTime)
                              ? "#011627"
                              : block.isAvailable
                                ? "#FEFEFE"
                                : "#E0E0E0",
                          color:
                            selectedTimeBlock?.dateTime && isEqual(selectedTimeBlock.dateTime, block.dateTime)
                              ? "#FFF"
                              : block.isAvailable
                                ? "#000"
                                : "#9E9E9E",
                          textAlign: "center",
                          padding: 2,
                          cursor: block.isAvailable ? "pointer" : "not-allowed",
                          opacity: block.isAvailable ? 1 : 0.6,
                        }}
                        onClick={() => handleTimeBlockClick(block)}
                      >
                        {format(block.dateTime, "h:mm a")}
                        <Typography variant="caption" display="block">
                          {block.isAvailable
                            ? `${block.availableTherapists.length} available`
                            : "Not available"}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            {/* Show only phone number for existing patients */}
            {isExisting && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Grid>
            )}

            {/* Show name and phone number for new patients */}
            {isExisting === false && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleBookAppointment}
                disabled={loading || !isFormValid()}
              >
                {loading ? <CircularProgress size={24} /> : "Book Appointment"}
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Contact info at the bottom */}
      <ContactBox/>
    </LocalizationProvider>
  );
};

export default MakeAppointmentScreen;