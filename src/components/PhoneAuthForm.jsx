// PhoneAuthForm.jsx
import React, { useState } from 'react';
import { auth } from '../firebase/firebase.config'; // your existing config file
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from '@mui/material';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

const PhoneAuthForm = () => {
  const [mode, setMode] = useState('login');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleModeChange = (_, newMode) => {
    if (newMode !== null) setMode(newMode);
  };

  const configureCaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA resolved:', response);
          },
          'expired-callback': () => {
            console.warn('reCAPTCHA expired. Please try again.');
          }
        }
      );
    }
  };
  
  const handleSendOtp = async () => {
    if (!phone) return alert('Please enter a valid phone number');
    configureCaptcha();

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = result;
      setIsOtpSent(true);
      alert('OTP sent successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert('Please enter the OTP');

    try {
      const result = await window.confirmationResult.confirm(otp);
      alert(`${mode === 'signup' ? 'Signed up' : 'Logged in'} successfully!`);
      console.log(result.user);
    } catch (err) {
      console.error(err);
      alert('Invalid OTP');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {mode === 'signup' ? 'Sign Up' : 'Login'} with Phone
        </Typography>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="signup">Sign Up</ToggleButton>
        </ToggleButtonGroup>

        {!isOtpSent ? (
          <>
            <PhoneInput
              placeholder="Enter phone number"
              value={phone}
              onChange={setPhone}
              defaultCountry="IN"
              international
              withCountryCallingCode
              className="phone-input"
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
            <div id="recaptcha-container"></div>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default PhoneAuthForm;
