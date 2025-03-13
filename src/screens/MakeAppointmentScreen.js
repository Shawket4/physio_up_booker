import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/Logo";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Snackbar,
  CircularProgress,
  Alert,
  Box,
  Container,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Stack,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { 
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from "axios";
import { format, parse, isEqual, addDays } from "date-fns";
import Cookies from "js-cookie";
import ContactBox from "../components/ContactBox";

const ServerIP = process.env.REACT_APP_SERVER_IP;

const MakeAppointmentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromAppointments = location.state?.fromAppointments;

  // State variables
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
  const [activeStep, setActiveStep] = useState(0);
  const [success, setSuccess] = useState(false);

  // Steps for the appointment booking process
  const steps = ['Select Date', 'Choose Time', 'Your Details'];

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
    // Group time blocks into morning, afternoon, and evening
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

        const timeCategory = 
          hour < 12 ? "Morning" :
          hour < 17 ? "Afternoon" : "Evening";

        blocks.push({
          dateTime: blockDateTime,
          isAvailable: availableTherapistsForBlock.length > 0,
          availableTherapists: availableTherapistsForBlock,
          timeCategory
        });
      }
    }
    setTimeBlocks(blocks);
    setSelectedTimeBlock(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeBlock(null);
    setSelectedTherapist(null);
  };

  const handleTimeBlockClick = (block) => {
    if (!block.isAvailable) {
      return;
    }
    setSelectedTimeBlock(block);
    
    // Always show therapist selection dialog, even if only one is available
    setAvailableTherapists(block.availableTherapists);
    setShowTherapistDialog(true);
  };

  const handleTherapistSelect = (therapist) => {
    setSelectedTherapist(therapist);
    setShowTherapistDialog(false);
    handleNextStep();
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
        setSuccess(true);
        // Store phone number in cookie for returning users
        if (!isExisting) {
          Cookies.set("phone_number", phoneNumber, { expires: 90 });
        }
        
        // Short delay to show success state
        setTimeout(() => {
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
        }, 1500);
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

  const handleNextStep = () => {
    setActiveStep(prevStep => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBackStep = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  // Group time blocks by category
  const groupedTimeBlocks = timeBlocks.reduce((acc, block) => {
    if (!acc[block.timeCategory]) {
      acc[block.timeCategory] = [];
    }
    acc[block.timeCategory].push(block);
    return acc;
  }, {});

  const renderDateSelector = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select an Appointment Date
      </Typography>
      
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, backgroundColor: "#FFFFFF" }}>
  <DatePicker
    label="Appointment Date"
    value={selectedDate}
    onChange={handleDateChange}
    minDate={new Date()}
    maxDate={addDays(new Date(), 30)}
    shouldDisableDate={(date) => format(date, 'EEEE') === 'Friday'}
    sx={{ width: '100%', mb: 2 }}
    format="EEEE, MMMM d, yyyy"
  />
  
  <Box 
    sx={{ 
      overflowX: 'auto', 
      pb: 1, 
      '&::-webkit-scrollbar': {
        height: '6px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '10px',
      }
    }}
  >
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-start', 
      mt: 2,
      minWidth: { xs: '500px', sm: 'auto' }
    }}>
      {(() => {
        const buttons = [];
        let currentDate = new Date();
        let daysAdded = 0;
        
        while (buttons.length < 7) {
          // Skip Fridays (5 is Friday in JavaScript's getDay(), where 0 is Sunday)
          if (currentDate.getDay() !== 5) {
            const date = new Date(currentDate);
            buttons.push(
              <Button
                key={daysAdded}
                variant={isEqual(date, selectedDate) ? "contained" : "outlined"}
                onClick={() => handleDateChange(date)}
                sx={{
                  flex: { xs: '0 0 auto', sm: 1 },
                  mx: 0.5,
                  flexDirection: 'column',
                  py: 1,
                  minWidth: { xs: '64px', sm: '0' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                <Typography variant="caption">{format(date, 'EEE')}</Typography>
                <Typography>{format(date, 'd')}</Typography>
              </Button>
            );
          }
          
          // Move to next day
          currentDate = addDays(currentDate, 1);
          daysAdded++;
        }
        
        return buttons;
      })()}
    </Box>
  </Box>
  
  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
    * Friday appointments are not available
  </Typography>
</Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNextStep}
          disabled={!selectedDate}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );

  const renderTimeSelector = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        {format(selectedDate, "EEEE, MMMM d, yyyy")}
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, backgroundColor: "#FFFFFF" }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {Object.keys(groupedTimeBlocks).map((category) => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                  {category}
                </Typography>
                
                <Grid container spacing={1.5}>
                  {groupedTimeBlocks[category].map((block, index) => (
                    <Grid item xs={4} sm={3} key={index}>
                      <Button
                        fullWidth
                        variant={selectedTimeBlock?.dateTime && isEqual(selectedTimeBlock.dateTime, block.dateTime) 
                          ? "contained" 
                          : "outlined"}
                        color={selectedTimeBlock?.dateTime && isEqual(selectedTimeBlock.dateTime, block.dateTime) 
                          ? "primary" 
                          : "inherit"}
                        onClick={() => handleTimeBlockClick(block)}
                        disabled={!block.isAvailable}
                        sx={{
                          py: 1,
                          backgroundColor: selectedTimeBlock?.dateTime && isEqual(selectedTimeBlock.dateTime, block.dateTime)
                            ? "#011627"
                            : block.isAvailable
                              ? "#FFFFFF"
                              : "#F5F5F5",
                          '&:hover': {
                            backgroundColor: block.isAvailable && !isEqual(selectedTimeBlock?.dateTime, block.dateTime)
                              ? "#E3F2FD"
                              : undefined
                          },
                          borderColor: block.isAvailable ? "#011627" : "#E0E0E0"
                        }}
                      >
                        <Box>
                          <Typography variant="body2">
                            {format(block.dateTime, "h:mm a")}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {block.isAvailable
                              ? `${block.availableTherapists.length} available`
                              : "Unavailable"}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button onClick={handleBackStep} startIcon={<ArrowBackIcon />}>
          Back
        </Button>
        <Button 
          variant="contained" 
          disabled={!selectedTimeBlock || !selectedTherapist}
          onClick={handleNextStep}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );

  const renderDetailsForm = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Confirm Your Details
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, backgroundColor: "#FFFFFF" }}>
        {/* Appointment Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Appointment Summary
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EventIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography>
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTimeIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography>
              {selectedTimeBlock && format(selectedTimeBlock.dateTime, "h:mm a")}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography>
              {selectedTherapist && selectedTherapist.name}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Patient Details Form */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Your Information
          </Typography>
          
          {/* Show only phone number for existing patients */}
          {isExisting ? (
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              InputProps={{
                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your registered phone number"
              sx={{ mb: 2 }}
            />
          ) : (
            <>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                sx={{ mb: 2 }}
              />
            </>
          )}
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button onClick={handleBackStep} startIcon={<ArrowBackIcon />}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleBookAppointment}
          disabled={loading || !isFormValid() || success}
          sx={{ minWidth: 150 }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : success ? (
            "Booked!"
          ) : (
            "Book Appointment"
          )}
        </Button>
      </Box>
    </Box>
  );

  // Dialog for selecting therapist with improved UI
  const renderTherapistDialog = () => (
    <Dialog 
      open={showTherapistDialog} 
      onClose={() => setShowTherapistDialog(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Typography variant="h6">Select Your Therapist</Typography>
        <Typography variant="body2" color="text.secondary">
        {selectedTimeBlock && format(new Date(selectedTimeBlock.dateTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <List sx={{ pt: 1 }}>
          {availableTherapists.length > 0 ? (
            availableTherapists.map((therapist) => (
              <Paper 
                key={therapist.ID}
                elevation={1} 
                sx={{ 
                  mb: 2, 
                  '&:hover': { 
                    backgroundColor: '#F5F9FF',
                    cursor: 'pointer'
                  },
                  borderRadius: 2
                }}
                onClick={() => handleTherapistSelect(therapist)}
              >
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#011627' }}>
                    {therapist.name.split(' ')[0].charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {therapist.name}
                      </Typography>
                    }
                  />
                </ListItem>
              </Paper>
            ))
          ) : (
            <Typography>No available therapists for this time slot.</Typography>
          )}
        </List>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => setShowTherapistDialog(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  // Dialog for selecting patient type with improved UI
  const renderPatientTypeDialog = () => (
    <Dialog
      open={showPatientTypeDialog}
      onClose={() => setShowPatientTypeDialog(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>Welcome</DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
          Please select an option to continue
        </Typography>
        
        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setIsExisting(false);
              setShowPatientTypeDialog(false);
              setPhoneNumber("");
            }}
            sx={{
              py: 1.5,
              backgroundColor: '#011627',
              '&:hover': { backgroundColor: '#01253e' }
            }}
            startIcon={<PersonAddIcon />}
          >
            New Patient
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              const savedPhoneNumber = Cookies.get("phone_number");
              if (savedPhoneNumber) {
                setPhoneNumber(savedPhoneNumber);
              }
              setIsExisting(true);
              setShowPatientTypeDialog(false);
            }}
            startIcon={<PersonIcon />}
          >
            Existing Patient
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => {
              setShowPatientTypeDialog(false);
              setShowPhoneNumberDialog(true);
            }}
            startIcon={<CalendarTodayIcon />}
          >
            View My Appointments
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );

  // Dialog for entering phone number to view appointments with improved UI
  const renderPhoneNumberDialog = () => (
    <Dialog 
      open={showPhoneNumberDialog} 
      onClose={() => setShowPhoneNumberDialog(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>View Your Appointments</DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please enter your phone number to view your scheduled appointments
        </Typography>
        
        <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          value={tempPhoneNumber}
          onChange={(e) => setTempPhoneNumber(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          placeholder="Enter your registered phone number"
        />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="text" 
            onClick={() => {
              setShowPhoneNumberDialog(false);
              setShowPatientTypeDialog(true);
            }}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            onClick={handleViewAppointments}
            disabled={loading || !tempPhoneNumber.trim()}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : "View Appointments"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  // Main render method
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* App Bar with improved UI */}
      <AppBar position="static" sx={{ backgroundColor: "#011627" }}>
        <Toolbar>
          {activeStep > 0 && (
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={handleBackStep}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Request Appointment
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Stepper for showing progress */}
      {!showPatientTypeDialog && !showPhoneNumberDialog && (
        <Box sx={{ width: '100%', bgcolor: '#F8FAFC' }}>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 2, px: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}
      
      {/* Main Container */}
      <Container maxWidth="md" sx={{ my: 2 }}>
        {/* Show logo only on initial screen */}
        
        {/* Error message if present */}
        {error && !showPhoneNumberDialog && !showPatientTypeDialog && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {/* Main content based on active step */}
        {!showPatientTypeDialog && !showPhoneNumberDialog && (
          <Box>
            {activeStep === 0 && renderDateSelector()}
            {activeStep === 1 && renderTimeSelector()}
            {activeStep === 2 && renderDetailsForm()}
          </Box>
        )}
      </Container>
      
      {/* Render all dialogs */}
      {renderPatientTypeDialog()}
      {renderPhoneNumberDialog()}
      {renderTherapistDialog()}
      
      {/* Success message */}
      <Snackbar 
        open={success} 
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Appointment booked successfully!
        </Alert>
      </Snackbar>
      
      {/* Contact info at the bottom */}
      <Box sx={{ mt: 4 }}>
        <ContactBox />
      </Box>
    </LocalizationProvider>
  );
};

export default MakeAppointmentScreen;