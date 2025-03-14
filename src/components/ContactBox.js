import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper, 
  Divider, 
  Tooltip, 
  Snackbar, 
  Alert,
  Stack,
  Link,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ContactBox = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const handleCopyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const contactInfo = {
    phone: '+201202770002',
    hours: 'Saturday-Thursday: 11am-11pm',
    address: {
      line1: 'Madinaty, All Seasons Park Mall',
      line2: '2nd Floor - S-75 Clinic'
    },
    social: [
      {
        name: 'WhatsApp',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        ),
        color: "#25D366",
        url: "https://api.whatsapp.com/send?phone=201202770002"
      },
      {
        name: "Instagram",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        ),
        color: "#E1306C",
        url: "https://instagram.com/physioup.clinic"
      },
      {
        name: "Facebook",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
          </svg>
        ),
        color: "#4267B2",
        url: "https://facebook.com/physioup.clinic"
      }
    ]
  };

  // Create contact item component to reduce repetition
  const ContactItem = ({ icon, label, value, action, actionLabel }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      backgroundColor: '#FFFFFF',
      borderRadius: 1.5,
      py: 1.5,
      px: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }
    }}>
      <Box sx={{ 
        color: theme.palette.primary.main, 
        mr: 1.5,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
      {action && (
        <Tooltip title={actionLabel || "Copy"}>
          <IconButton
            onClick={action}
            size="small"
            sx={{ 
              color: theme.palette.primary.main,
              transition: 'transform 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '30',
                transform: 'scale(1.1)'
              }
            }}
            aria-label={actionLabel || "Copy"}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  const SocialLinks = () => (
    <Box sx={{ 
      display: "flex", 
      justifyContent: "center", 
      gap: { xs: 2, sm: 3 },
      py: 1.5 
    }}>
      {contactInfo.social.map((platform) => (
        <Tooltip key={platform.name} title={platform.name}>
          <Link 
            target="_blank"
            rel="noopener noreferrer"
            href={platform.url} 
            aria-label={`Contact us on ${platform.name}`}
            sx={{ 
              color: platform.color, 
              transition: 'transform 0.2s, opacity 0.2s',
              display: 'flex',
              padding: 1,
              borderRadius: '50%',
              backgroundColor: platform.color + '15',
              '&:hover': { 
                transform: 'scale(1.15)',
                opacity: 0.9,
                backgroundColor: platform.color + '25',
              }
            }}
          >
            {platform.icon}
          </Link>
        </Tooltip>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="md" disableGutters sx={{ my: 2 }}>
      <Paper elevation={isMobile ? 1 : 3} sx={{ 
        padding: { xs: 2.5, sm: 3 }, 
        backgroundColor: "#F9FAFF", 
        margin: { xs: 1, sm: 2 },
        borderRadius: 3,
        border: '1px solid #E0E6F5',
        background: 'linear-gradient(145deg, #FCFDFF 0%, #F6F8FF 100%)',
      }}>
        <Typography 
          variant="h5" 
          component="h2" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            color: theme.palette.primary.dark,
            mb: 3
          }}
        >
          Contact Us
        </Typography>
        
        <Stack spacing={2.5}>
          {/* Phone Section */}
          <ContactItem 
            icon={<PhoneIcon />}
            label="Call Us"
            value={contactInfo.phone}
            action={() => handleCopyToClipboard(contactInfo.phone, "Phone number copied!")}
            actionLabel="Copy phone number"
          />

          {/* Hours Section */}
          <ContactItem 
            icon={<AccessTimeIcon />}
            label="Working Hours"
            value={contactInfo.hours}
          />

          {/* Social Media Section */}
          <Box sx={{ mt: 1 }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              align="center" 
              sx={{ display: 'block', mb: 1 }}
            >
              Connect With Us
            </Typography>
            <SocialLinks />
          </Box>

          <Divider sx={{ opacity: 0.6, my: 1 }} />

          {/* Address Section */}
          <Link 
            target="_blank"
            rel="noopener noreferrer"
            href="https://maps.app.goo.gl/bCuK48LpXtiEZc2S9?g_st=iw" 
            underline="none"
            sx={{ 
              color: "inherit",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.7)',
              transition: 'all 0.2s ease',
              '&:hover': { 
                backgroundColor: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
                '& .MuiTypography-root': { color: theme.palette.primary.main }
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 1
            }}>
              <LocationOnIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                Find us on Google Maps
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                color: 'text.secondary', 
                transition: 'color 0.2s',
                fontSize: '0.9rem'
              }}
            >
              {contactInfo.address.line1}
              <br />
              {contactInfo.address.line2}
            </Typography>
          </Link>  
        </Stack>

{/* Toast notification */}
<Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="success" 
            variant="filled"
            sx={{ 
              width: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ContactBox;