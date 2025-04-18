import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const steps = ["Shipping Information", "Payment Method", "Review Order"];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Cart items from your page
  const cartItems = [
    {
      name: "Swadeshi Haritaki Churna Pack of 2",
      price: 0,
      quantity: 1,
    },
    {
      name: "Biotique Bio Citron Stimulating Body Massage Oil",
      price: 0,
      quantity: 1,
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const renderShippingForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="firstName"
          name="firstName"
          label="First Name"
          fullWidth
          autoComplete="given-name"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="lastName"
          name="lastName"
          label="Last Name"
          fullWidth
          autoComplete="family-name"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="email"
          name="email"
          label="Email Address"
          fullWidth
          autoComplete="email"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="address1"
          name="address1"
          label="Address Line 1"
          fullWidth
          autoComplete="shipping address-line1"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="address2"
          name="address2"
          label="Address Line 2"
          fullWidth
          autoComplete="shipping address-line2"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="city"
          name="city"
          label="City"
          fullWidth
          autoComplete="shipping address-level2"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="state"
          name="state"
          label="State/Province/Region"
          fullWidth
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="zip"
          name="zip"
          label="Zip / Postal code"
          fullWidth
          autoComplete="shipping postal-code"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            id="country"
            label="Country"
            defaultValue="IN"
          >
            <MenuItem value="IN">India</MenuItem>
            <MenuItem value="US">United States</MenuItem>
            <MenuItem value="CA">Canada</MenuItem>
            <MenuItem value="UK">United Kingdom</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="phone"
          name="phone"
          label="Phone Number"
          fullWidth
          autoComplete="tel"
          variant="outlined"
        />
      </Grid>
    </Grid>
  );

  const renderPaymentForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <FormControlLabel
            value="card"
            control={<Radio />}
            label="Credit/Debit Card"
          />
          <FormControlLabel
            value="upi"
            control={<Radio />}
            label="UPI Payment"
          />
          <FormControlLabel
            value="cod"
            control={<Radio />}
            label="Cash on Delivery"
          />
          <FormControlLabel
            value="netbanking"
            control={<Radio />}
            label="Net Banking"
          />
        </RadioGroup>
      </Grid>

      {paymentMethod === "card" && (
        <>
          <Grid item xs={12}>
            <TextField
              required
              id="cardName"
              label="Name on card"
              fullWidth
              autoComplete="cc-name"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="cardNumber"
              label="Card number"
              fullWidth
              autoComplete="cc-number"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="expDate"
              label="Expiry date (MM/YY)"
              fullWidth
              autoComplete="cc-exp"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="cvv"
              label="CVV"
              helperText="Last three digits on signature strip"
              fullWidth
              autoComplete="cc-csc"
              variant="outlined"
            />
          </Grid>
        </>
      )}

      {paymentMethod === "upi" && (
        <Grid item xs={12}>
          <TextField
            required
            id="upiId"
            label="UPI ID"
            placeholder="username@bankname"
            fullWidth
            variant="outlined"
          />
        </Grid>
      )}

      {paymentMethod === "netbanking" && (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="bank-select-label">Select Bank</InputLabel>
            <Select
              labelId="bank-select-label"
              id="bank-select"
              label="Select Bank"
            >
              <MenuItem value="sbi">State Bank of India</MenuItem>
              <MenuItem value="hdfc">HDFC Bank</MenuItem>
              <MenuItem value="icici">ICICI Bank</MenuItem>
              <MenuItem value="axis">Axis Bank</MenuItem>
              <MenuItem value="kotak">Kotak Mahindra Bank</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );

  const renderOrderSummary = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = 50; // Shipping cost
    const total = subtotal + shipping;

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        {cartItems.map((item, index) => (
          <Box
            key={index}
            sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
          >
            <Typography variant="body1">
              {item.name} × {item.quantity}
            </Typography>
            <Typography variant="body1">₹{item.price.toFixed(2)}</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body1">Subtotal</Typography>
          <Typography variant="body1">₹{subtotal.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body1">Shipping</Typography>
          <Typography variant="body1">₹{shipping.toFixed(2)}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">₹{total.toFixed(2)}</Typography>
        </Box>
      </Box>
    );
  };

  const renderOrderReview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Order Review
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Shipping Address
          </Typography>
          <Typography variant="body2">
            John Doe
            <br />
            123 Example Street
            <br />
            Mumbai, Maharashtra 400001
            <br />
            India
            <br />
            +91 9876543210
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Payment Method
          </Typography>
          <Typography variant="body2">
            {paymentMethod === "card" && "Credit/Debit Card ending in 1234"}
            {paymentMethod === "upi" && "UPI Payment (username@bankname)"}
            {paymentMethod === "cod" && "Cash on Delivery"}
            {paymentMethod === "netbanking" && "Net Banking (SBI)"}
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Order Items
          </Typography>
          {cartItems.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">
                {item.name} × {item.quantity}
              </Typography>
              <Typography variant="body2">₹{item.price.toFixed(2)}</Typography>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderShippingForm();
      case 1:
        return renderPaymentForm();
      case 2:
        return renderOrderReview();
      default:
        throw new Error("Unknown step");
    }
  };

  const renderOrderComplete = () => (
    <Box sx={{ textAlign: "center", py: 5 }}>
      <Typography variant="h5" gutterBottom>
        Thank you for your order!
      </Typography>
      <Typography variant="subtitle1">
        Your order number is #2001539. We have emailed your order confirmation,
        and will send you an update when your order has shipped.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => (window.location.href = "/")}
      >
        Continue Shopping
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Checkout
      </Typography>

      {activeStep === steps.length ? (
        renderOrderComplete()
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                {getStepContent(activeStep)}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Place Order" : "Next"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>{renderOrderSummary()}</CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CheckoutPage;
