import React, { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import {
  Box, Button, Checkbox, Container, FormControlLabel, Grid, InputAdornment,
  TextField, Typography, Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Register = () => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const [timer, setTimer] = useState(30);
  const resendTimerRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      resendTimerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(resendTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(resendTimerRef.current);
  }, [step]);

  // Cleanup function to clear reCAPTCHA when component unmounts
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (error) {
          console.error("Error clearing reCAPTCHA:", error);
        }
      }
    };
  }, []);

  const setupRecaptcha = () => {
    try {
      // Clean up any existing instance
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      
      // Create a new instance
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved:', response);
          },
          'expired-callback': () => {
            console.warn('reCAPTCHA expired');
            alert("reCAPTCHA expired. Please try again.");
          }
        }
      );
      
      return recaptchaVerifierRef.current;
    } catch (error) {
      console.error('reCAPTCHA init error:', error);
      alert(`Failed to initialize reCAPTCHA: ${error.message}`);
      return null;
    }
  };

  const handleSendOtp = async () => {
    try {
      // Setup reCAPTCHA right before using it
      const recaptchaVerifier = setupRecaptcha();
      if (!recaptchaVerifier) return;
      
      // Ensure proper phone number format
      const fullPhone = `+91${phone}`;
      console.log("Sending OTP to:", fullPhone);
      
      const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaVerifier);
      console.log("OTP sent successfully");
      setConfirmationResult(result);
      setStep('otp');
    } catch (error) {
      console.error("OTP Send Failed:", error);
      
      // More detailed error message for debugging
      if (error.code === 'auth/invalid-app-credential') {
        alert("Firebase configuration issue. Please verify your Firebase setup and domain settings.");
      } else if (error.code === 'auth/quota-exceeded') {
        alert("SMS quota exceeded. Try again later.");
      } else {
        alert(`Failed to send OTP: ${error.message}`);
      }
      
      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (clearError) {
          console.error("Error clearing reCAPTCHA:", clearError);
        }
      }
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setOtpError(true);
      return;
    }
    try {
      await confirmationResult.confirm(fullOtp);
      setStep('success');
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      setOtpError(true);
      alert(`OTP verification failed: ${error.message}`);
    }
  };

  const handleOtpChange = (value, index) => {
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setOtpError(false);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      // Setup a new reCAPTCHA for resend
      const recaptchaVerifier = setupRecaptcha();
      if (!recaptchaVerifier) return;
      
      const fullPhone = `+91${phone}`;
      const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setTimer(30);
      alert("OTP has been resent to your phone.");
    } catch (error) {
      console.error("OTP Resend Failed:", error);
      alert(`Failed to resend OTP: ${error.message}`);
    }
  };

  const isSendEnabled = /^[6-9]\d{9}$/.test(phone) && termsAccepted;

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
        {step === 'phone' && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">BlueMedix</Typography>
              <Typography color="text.secondary">Secure Authentication</Typography>
            </Box>

            <Typography variant="h6" gutterBottom>Enter Your Mobile Number</Typography>
            <Typography color="text.secondary" gutterBottom>We'll send you a 6-digit OTP</Typography>

            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              InputProps={{
                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
              }}
              sx={{ my: 2 }}
            />

            <FormControlLabel
              control={<Checkbox checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />}
              label={
                <Typography variant="body2">
                  I agree to the <a href="#" style={{ color: '#1976d2' }}>Terms & Conditions</a> and <a href="#" style={{ color: '#1976d2' }}>Privacy Policy</a>
                </Typography>
              }
            />

            <Button
              variant="contained"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              onClick={handleSendOtp}
              disabled={!isSendEnabled}
              sx={{ mt: 2 }}
            >
              Send OTP
            </Button>
          </>
        )}

        {step === 'otp' && (
          <>
            <Typography variant="h6" gutterBottom>Verify OTP</Typography>
            <Typography color="text.secondary">
              Enter the 6-digit code sent to <strong>+91 {phone}</strong>
            </Typography>

            <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
              {otp.map((val, i) => (
                <Grid item key={i}>
                  <TextField
                    id={`otp-${i}`}
                    inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem' } }}
                    value={val}
                    onChange={(e) => handleOtpChange(e.target.value.replace(/\D/g, ''), i)}
                    error={otpError}
                  />
                </Grid>
              ))}
            </Grid>

            {otpError && (
              <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                Invalid OTP. Please try again.
              </Typography>
            )}

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Button onClick={handleResendOtp} disabled={timer > 0}>
                Resend OTP
              </Button>
              {timer > 0 && (
                <Typography variant="caption" color="text.secondary">
                  Resend OTP in {timer}s
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleVerifyOtp}
            >
              Verify & Continue
            </Button>

            <Button
              fullWidth
              startIcon={<ArrowBackIcon />}
              onClick={() => setStep('phone')}
              sx={{ mt: 1 }}
            >
              Back to Phone Number
            </Button>
          </>
        )}

        {step === 'success' && (
          <Box textAlign="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>Verification Successful!</Typography>
            <Typography color="text.secondary">You have successfully verified your mobile number.</Typography>
            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => alert('Redirect to dashboard')}>
              Continue to Dashboard
            </Button>
          </Box>
        )}
      </Paper>

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </Container>
  );
};

export default Register;