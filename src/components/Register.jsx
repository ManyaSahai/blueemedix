import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Initialize Firebase at the top level, outside of component
const firebaseConfig = {
  apiKey: "AIzaSyBpLeyan7LT4-s1byv4LlokL0z5AlnETns",
  authDomain: "bluemedixauth.firebaseapp.com",
  projectId: "bluemedixauth",
  storageBucket: "bluemedixauth.firebasestorage.app",
  messagingSenderId: "806816581906",
  appId: "1:806816581906:web:9af054065129342c730bcb",
  measurementId: "G-PC8VDDGDWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Register = () => {
  // API endpoint
  const API_URL = 'http://localhost:5000/api'; // Change this to your actual API URL

  // State variables
  const [currentStep, setCurrentStep] = useState('phone'); // phone, otp, register, success, existingUser
  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    e_mail: '',
    password: '',
    date_of_birth: '',
    gender: '',
    role: '',
    phone_no: '',
    desc: '',
    address: {
      first_line: '',
      second_line: '',
      city: '',
      state: '',
      pin_code: ''
    },
    region: ''
  });
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [userToken, setUserToken] = useState('');
  const [firebaseToken, setFirebaseToken] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Refs
  const recaptchaVerifierRef = useRef(null);
  const otpInputsRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Initialize recaptcha on component mount
  useEffect(() => {
    // Don't initialize immediately, let the component render first
    const timer = setTimeout(() => {
      initializeRecaptcha();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(timerIntervalRef.current);
      // Clean up recaptcha
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (error) {
          console.error("Error clearing reCAPTCHA:", error);
        }
      }
    };
  }, []);

  // Initialize recaptcha
  const initializeRecaptcha = () => {
    try {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
      
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log("reCAPTCHA verified successfully");
        },
        'expired-callback': () => {
          console.log("reCAPTCHA expired");
        }
      });
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error);
    }
  };

  // Validate phone number
  const isPhoneValid = (phoneNum) => {
    return /^[6-9]\d{9}$/.test(phoneNum);
  };

  // Send OTP
  const sendOtp = async () => {
    if (!isPhoneValid(phone) || !termsChecked) {
      return;
    }

    setIsLoading(true);

    try {
      // First, check with our backend if the user exists
      const response = await fetch(`${API_URL}/auth/login/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobile: phone,
          code: '91'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Ensure reCAPTCHA verifier is initialized before sending OTP
        if (!recaptchaVerifierRef.current) {
          initializeRecaptcha();
        }
        
        try {
          // Then use Firebase to actually send the OTP
          const phoneWithCode = `+91${phone}`;
          
          const confirmResult = await signInWithPhoneNumber(auth, phoneWithCode, recaptchaVerifierRef.current);
          setConfirmationResult(confirmResult);
          setIsNewUser(!data.userExists);
          setCurrentStep('otp');
          startResendTimer();
        } catch (firebaseError) {
          console.error('Firebase Error:', firebaseError);
          console.error('Error code:', firebaseError.code);
          console.error('Error message:', firebaseError.message);
          
          // Create a more user-friendly error message
          let errorMsg = 'Failed to send OTP. ';
          
          if (firebaseError.code === 'auth/invalid-app-credential') {
            errorMsg += 'There was an issue with verification. Please try again later.';
          } else if (firebaseError.code === 'auth/captcha-check-failed') {
            errorMsg += 'CAPTCHA verification failed. Please refresh and try again.';
          } else if (firebaseError.code === 'auth/quota-exceeded') {
            errorMsg += 'We\'ve reached our verification limit. Please try again later.';
          } else if (firebaseError.code === 'auth/user-disabled') {
            errorMsg += 'This phone number has been disabled.';
          } else if (firebaseError.code === 'auth/invalid-phone-number') {
            errorMsg += 'The phone number format is incorrect.';
          } else {
            errorMsg += firebaseError.message;
          }
          
          alert(errorMsg);
          
          // Re-initialize reCAPTCHA for next attempt
          initializeRecaptcha();
        }
      } else {
        alert(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to connect to server. Please try again.');
    }

    setIsLoading(false);
  };

  // Start resend timer
  const startResendTimer = () => {
    clearInterval(timerIntervalRef.current);
    
    setIsResendDisabled(true);
    setSecondsLeft(30);
    
    timerIntervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(0, 1);
    setOtpValues(newOtpValues);
    
    setOtpError('');
    
    // Move focus to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otp = otpValues.join('');
    
    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify with Firebase
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      setFirebaseToken(idToken);
      
      // Verify with our backend
      const response = await fetch(`${API_URL}/auth/verify/otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobile: phone,
          firebase_token: idToken
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUserToken(data.token);
        
        // Update form data with phone number
        setFormData(prev => ({
          ...prev,
          phone_no: phone
        }));
        
        // Check if new user or existing user
        if (data.isNewUser) {
          setCurrentStep('register');
        } else {
          setCurrentStep('existingUser');
        }
      } else {
        setOtpError(data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Invalid OTP or verification failed');
    }
    
    setIsLoading(false);
  };

  // Resend OTP
  const resendOtp = async () => {
    if (isResendDisabled) return;
    
    try {
      // Re-initialize recaptcha
      initializeRecaptcha();
      
      // Send OTP again
      const phoneWithCode = `+91${phone}`;
      const confirmResult = await signInWithPhoneNumber(auth, phoneWithCode, recaptchaVerifierRef.current);
      setConfirmationResult(confirmResult);
      startResendTimer();
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Failed to resend OTP. Please try again.');
    }
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Register user
  const registerUser = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Register user with our backend
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update token with new user info
        setUserToken(data.token);
        
        // Show success message
        setCurrentStep('success');
        
        // Save token to localStorage for future use
        localStorage.setItem('blueMedixToken', data.token);
        localStorage.setItem('blueMedixUser', JSON.stringify(data.user));
      } else {
        setRegistrationError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('API error:', error);
      setRegistrationError('Failed to connect to server. Please try again.');
    }
    
    setIsLoading(false);
  };

  // Go to dashboard
  const goToDashboard = () => {
    // Save token to localStorage for future use
    localStorage.setItem('blueMedixToken', userToken);
    
    // In a real app, you would redirect to the dashboard
    window.location.href = '/dashboard.html';
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">BlueMedix</h1>
              <p className="text-blue-100">Authentication & Registration</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <i className="fas fa-user-shield text-2xl"></i>
            </div>
          </div>
        </div>
        
        {/* Auth Flow Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Step 1: Phone Number Verification */}
          {currentStep === 'phone' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Enter Your Mobile Number</h2>
                <p className="text-gray-600">We'll send you a 6-digit OTP for verification</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="px-4 py-3 bg-gray-100 border-r border-gray-300 flex items-center">
                    <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3 mr-2" />
                    <span className="text-gray-700">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    className="flex-1 px-4 py-3 outline-none" 
                    placeholder="9876543210" 
                    maxLength="10" 
                    pattern="[0-9]{10}" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.slice(0, 10))}
                  />
                </div>
                
                {/* Add a container for the reCAPTCHA */}
                <div id="recaptcha-container" className="flex justify-center my-4"></div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="termsCheck" 
                    className="mr-2"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                  />
                  <label htmlFor="termsCheck" className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-blue-600">Terms & Conditions</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
                  </label>
                </div>
                
                <button 
                  id="sendOtpBtn"
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center ${(!isPhoneValid(phone) || !termsChecked) ? 'opacity-50' : ''}`}
                  disabled={!isPhoneValid(phone) || !termsChecked || isLoading}
                  onClick={sendOtp}
                >
                  {isLoading ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i> Sending OTP...</>
                  ) : (
                    <><span>Send OTP</span><i className="fas fa-arrow-right ml-2"></i></>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Rest of the component remains the same */}
          {/* OTP, Register, Success, and ExistingUser components remain unchanged */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default Register;