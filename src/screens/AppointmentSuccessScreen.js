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
} from "@mui/material";
import Lottie from "lottie-react"; // Import Lottie
import successAnimation from "../assets/success-animation.json"; // Import the animation JSON file
import Cookies from "js-cookie"; // Import js-cookie
import ContactBox from "../components/ContactBox";
import Logo from "../components/Logo";
const AppointmentSuccessScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentData = location.state?.appointmentData || {};
  const patientId = Cookies.get("patient_id"); // Read the patient_id cookie

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#011627" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Appointment Success
          </Typography>
        </Toolbar>
      </AppBar>
      <Logo/>
      <Card sx={{ margin: 2, padding: 3, backgroundColor: "#F1F3FF" }}>
        <Grid container spacing={3} direction="column" alignItems="center">
          <Grid item xs={12} textAlign="center">
            {/* Lottie Animation */}
            <Box
              display="flex"
              justifyContent="center" // Center horizontally
              alignItems="center" // Center vertically
              height={200} // Set a fixed height for the container
            >
              <Lottie
                animationData={successAnimation}
                loop={true}
                style={{ width: 150, height: 150 }}
              />
            </Box>
            <Typography variant="h4" sx={{ mt: 2, color: "#011627" }}>
              Appointment Requested Successfully!
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, color: "#666" }}>
              Your appointment has been submitted. The clinic will contact you to confirm.
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ width: "100%" }}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Appointment Details
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" fontWeight="medium">
                    {appointmentData.date || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Time
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" fontWeight="medium">
                    {appointmentData.time || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Therapist
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" fontWeight="medium">
                    {appointmentData.therapistName || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Treatment
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" fontWeight="medium">
                    {appointmentData.treatment || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Patient ID:
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body1" fontWeight="medium">
                  {patientId || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Display Patient ID at the bottom of the card */}

          <Grid item xs={12} sx={{ width: "100%", mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleBack}
              sx={{ backgroundColor: "#011627", mt: 2 }}
            >
              Back to Home
            </Button>
          </Grid>
        </Grid>
      </Card>
      <ContactBox/>
    </>
  );
};

export default AppointmentSuccessScreen;