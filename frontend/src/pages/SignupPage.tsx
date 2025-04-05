import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid2,
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SIGNUP_URL } from "../api/constants/endpoints";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSignup = async () => {
    try {
      console.log('username:', username , ' ', email, ' ', password, ' ', role);
      const res = await axios.post(SIGNUP_URL, {username, email, password, role });
      console.log('res--->', res);
      navigate("/login");
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid2
        container
        direction="column"
        sx={{
          justifyContent: "center",
          padding: "40px 50px",
          margin: "30px 10px",
          border: "1px solid black",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h6" sx={{color: "rgb(154, 0, 54)"}}>Sign Up with The Souled Store</Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Role"
          fullWidth
          margin="normal"
          onChange={(e) => setRole(e.target.value)}
        />
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: "10px" }}
          fullWidth
          onClick={handleSignup}
        >
          Sign Up
        </Button>

        <Typography
          sx={{ padding: "10px" }}
          textAlign="center"
          padding="20px"
          variant="body1"
        >
          Already a customer ? {}
          <span
            style={{
              color: "rgb(154, 0, 54)",
              fontWeight: "bold",
              textDecoration: "underline",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            Log In
          </span>
        </Typography>
      </Grid2>
    </Container>
  );
};

export default SignupPage;
