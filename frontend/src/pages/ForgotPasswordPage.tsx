import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import {
  FORGOT_PASSWORD_URL,
  RESET_PASSWORD_URL,
} from "../api/constants/endpoints";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleForgotPassword = async () => {
    try {
      await axios.post(FORGOT_PASSWORD_URL, { email });
      alert("OTP sent to your email. Please check and enter it below.");
      setIsOtpSent(true);
    } catch (error) {
      alert("Error sending reset email");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post(RESET_PASSWORD_URL, { email, otp, newPassword });
      alert("Password reset successfully! You can now log in.");
      navigate("/login");
    } catch (error) {
      alert("Error resetting password");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "50px",
          marginTop: "50px",
          border: "1px solid black",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {isOtpSent ? "Reset Password" : "Forgot Password"}
        </Typography>

        {!isOtpSent ? (
          <>
            <Typography variant="subtitle2">Enter your email and we'll send you a otp to reset your password</Typography>
            <TextField
              label="Email"
              margin="normal"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleForgotPassword}
            >
              Send Email
            </Button>
            <span
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
              onClick={()=> navigate('/login')}
            >
              <ArrowBackIosIcon fontSize="small" /> Back to Login
            </span>
          </>
        ) : (
          <>
            <TextField
              label="OTP"
              margin="normal"
              fullWidth
              onChange={(e) => setOtp(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              margin="normal"
              fullWidth
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
