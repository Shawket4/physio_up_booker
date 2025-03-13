import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Card,
  Grid,
  Button,
  Box,
  Divider,
  Paper,
  Container,
  Chip,
  Avatar
} from "@mui/material";
import Lottie from "lottie-react";
import successAnimation from "../assets/success-animation.json";
import Cookies from "js-cookie";
import ContactBox from "../components/ContactBox";
import Logo from "../components/Logo";
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BadgeIcon from '@mui/icons-material/Badge';
import HomeIcon from '@mui/icons-material/Home';

const AppointmentSuccessScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentData = location.state?.appointmentData || {};
  const patientId = Cookies.get("patient_id");

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Box sx={{ backgroundColor: "#f5f7ff", minHeight: "100vh" }}> 
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}
        >
          {/* Success Banner */}
          <Box 
            sx={{ 
              background: 'linear-gradient(45deg, #013a63 0%, #016293 100%)',
              py: 4,
              position: 'relative'
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={180}
            >
              <Lottie
                animationData={successAnimation}
                loop={true}
                style={{ width: 160, height: 160 }}
              />
            </Box>
          </Box>
          
          {/* Content */}
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 700, color: "#011627", mb: 1 }}>
              Appointment Requested!
            </Typography>
            <Typography variant="subtitle1" align="center" sx={{ color: "#666", mb: 4 }}>
              Your appointment has been successfully submitted. The clinic will contact you shortly to confirm your booking.
            </Typography>
            
            <Divider sx={{ my: 3 }}>
              <Chip label="APPOINTMENT DETAILS" sx={{ fontWeight: 600 }} />
            </Divider>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, height: '100%', borderLeft: '4px solid #3f51b5' }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <EventIcon sx={{ color: '#3f51b5', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="medium">
                    {appointmentData.date || "Not specified"}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, height: '100%', borderLeft: '4px solid #f50057' }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <AccessTimeIcon sx={{ color: '#f50057', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Time
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="medium">
                    {appointmentData.time || "Not specified"}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, height: '100%', borderLeft: '4px solid #4caf50' }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <PersonIcon sx={{ color: '#4caf50', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Therapist
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="medium">
                    {appointmentData.therapistName || "Not assigned yet"}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, height: '100%', borderLeft: '4px solid #ff9800' }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <LocalHospitalIcon sx={{ color: '#ff9800', mr: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Treatment
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="medium">
                    {appointmentData.treatment || "Not specified"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Paper 
              elevation={1} 
              sx={{ 
                mt: 3, 
                p: 2, 
                backgroundColor: '#f8f9fa',
                border: '1px dashed #ccc',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <BadgeIcon sx={{ color: '#011627', mr: 2 }} />
              <Box>
                <Typography variant="overline" display="block">
                  YOUR PATIENT ID
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {patientId || "ID not available"}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Please save this ID for future reference
                </Typography>
              </Box>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleBack}
                startIcon={<HomeIcon />}
                sx={{ 
                  backgroundColor: "#011627",
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#013a63"
                  }
                }}
              >
                Back to Home
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      <Box sx={{ mt: 4 }}>
        <ContactBox />
      </Box>
    </Box>
  );
};

export default AppointmentSuccessScreen;