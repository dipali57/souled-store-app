import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  IconButton,
  InputAdornment,
  Grid2,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React from "react";

const LoginPage = () => {
  const auth = useAuth(); // Ensure auth is not null
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      console.log("in Handle login", email, "pass", password);
      await auth.login(email, password);
      navigate("/");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid2
        container
        direction="column"
        sx={{
          justifyContent: "center",
          padding: "80px 60px",
          margin: "50px 10px",
          border: "1px solid black",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h6" sx={{color: "rgb(154, 0, 54)"}}>Login with The Souled Store</Typography>
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
        {/* <label onClick={() => navigate("/forgot-password")}>
          Forgot password ?
        </label>
           */}
        <Typography
          variant="body1"
          textAlign="end"
          padding="10px 0px"
          // color="blue"
          onClick={() => navigate("/forgot-password")}
        >
          {" "}
          Forgot password ?
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* <Typography sx={{ padding: "10px"}} textAlign="center" padding="20px" variant="body1" onClick={() => navigate("/signup")}> Signup Here</Typography> */}
        <Typography
          sx={{ padding: "10px" }}
          textAlign="center"
          padding="20px"
          variant="body1"
        >
          New User ?
          <span
            style={{
              padding: "10px",
              color: "rgb(154, 0, 54)",
              fontWeight: "bold",
              textDecoration: "underline",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </Typography>
      </Grid2>
    </Container>
  );
};

export default LoginPage;
