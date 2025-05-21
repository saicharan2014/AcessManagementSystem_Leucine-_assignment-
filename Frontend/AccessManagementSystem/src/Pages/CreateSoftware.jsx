import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSoftware } from "../API/software";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

const CreateSoftware = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accessLevels: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const accessLevelOptions = ["Read", "Write", "Admin"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccessLevelChange = (level) => {
    setFormData((prev) => {
      const newAccessLevels = prev.accessLevels.includes(level)
        ? prev.accessLevels.filter((l) => l !== level)
        : [...prev.accessLevels, level];
      return { ...prev, accessLevels: newAccessLevels };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.description ||
      formData.accessLevels.length === 0
    ) {
      setError("All fields are required");
      return;
    }

    try {
      await createSoftware(
        formData.name,
        formData.description,
        formData.accessLevels
      );
      setSuccess("Software created successfully!");
      setFormData({
        name: "",
        description: "",
        accessLevels: [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create software");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Software
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Software Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Access Levels
          </Typography>

          <FormGroup>
            {accessLevelOptions.map((level) => (
              <FormControlLabel
                key={level}
                control={
                  <Checkbox
                    checked={formData.accessLevels.includes(level)}
                    onChange={() => handleAccessLevelChange(level)}
                  />
                }
                label={level}
              />
            ))}
          </FormGroup>

          <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>
            Create Software
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateSoftware;
