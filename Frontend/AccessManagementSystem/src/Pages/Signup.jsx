import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup, createAdmin, createManager } from "../API/auth"; // ⬅️ Add createManager
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Link,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    masterKey: "",
  });
  const [role, setRole] = useState("Employee"); // "Employee", "Admin", "Manager"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.name;
    setRole((prev) => (prev === newRole ? "Employee" : newRole));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      if (role === "Admin" || role === "Manager") {
        if (!formData.masterKey) {
          setError("Master key is required for " + role + " signup");
          return;
        }

        if (role === "Admin") {
          await createAdmin(
            formData.username,
            formData.password,
            formData.masterKey
          );
        } else {
          await createManager(
            formData.username,
            formData.password,
            formData.masterKey
          );
        }
      } else {
        await signup(formData.username, formData.password);
      }

      navigate("/login", {
        state: {
          successMessage: `${role} registration successful! Please login.`,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Username may be taken."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {role} Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={role === "Admin"}
                  onChange={handleRoleChange}
                  name="Admin"
                />
              }
              label="Register as Admin"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={role === "Manager"}
                  onChange={handleRoleChange}
                  name="Manager"
                />
              }
              label="Register as Manager"
            />
          </FormGroup>

          {(role === "Admin" || role === "Manager") && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="masterKey"
              label="Master Key"
              type="password"
              id="masterKey"
              value={formData.masterKey}
              onChange={handleChange}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
