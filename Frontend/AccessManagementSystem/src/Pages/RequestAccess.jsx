import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { createRequest, getUserRequests } from "../API/request";
import { getAllSoftware } from "../API/software";

const RequestAccess = () => {
  const [formData, setFormData] = useState({
    softwareId: "",
    accessType: "",
    reason: "",
  });
  const [softwareList, setSoftwareList] = useState([]);
  const [accessLevels, setAccessLevels] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [softwareRes, requestsRes] = await Promise.all([
          getAllSoftware(),
          getUserRequests(),
        ]);
        setSoftwareList(softwareRes.data);
        setUserRequests(requestsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.softwareId) {
      const selectedSoftware = softwareList.find(
        (s) => s.id === formData.softwareId
      );
      if (selectedSoftware) {
        setAccessLevels(selectedSoftware.accessLevels);
        if (!selectedSoftware.accessLevels.includes(formData.accessType)) {
          setFormData((prev) => ({ ...prev, accessType: "" }));
        }
      }
    } else {
      setAccessLevels([]);
      setFormData((prev) => ({ ...prev, accessType: "" }));
    }
  }, [formData.softwareId, softwareList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.softwareId || !formData.accessType || !formData.reason) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await createRequest(
        formData.softwareId,
        formData.accessType,
        formData.reason
      );

      // Refresh requests
      const response = await getUserRequests();
      setUserRequests(response.data);

      setSuccess("Access request submitted successfully");
      setFormData({
        softwareId: "",
        accessType: "",
        reason: "",
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !softwareList.length) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Request Software Access
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Software</InputLabel>
            <Select
              name="softwareId"
              value={formData.softwareId}
              onChange={handleChange}
              label="Software"
              required
            >
              {softwareList.map((software) => (
                <MenuItem key={software.id} value={software.id}>
                  {software.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Access Type</InputLabel>
            <Select
              name="accessType"
              value={formData.accessType}
              onChange={handleChange}
              label="Access Type"
              required
              disabled={!formData.softwareId}
            >
              {accessLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Reason for Access"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Request"}
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>
          My Previous Requests
        </Typography>

        {userRequests.length === 0 ? (
          <Typography>No previous requests found</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {userRequests.map((request) => (
              <Card key={request.id}>
                <CardContent>
                  <Typography variant="h6">
                    {request.software?.name} - {request.accessType}
                  </Typography>
                  <Typography color="text.secondary">
                    Status: {request.status}
                  </Typography>
                  <Typography>Reason: {request.reason}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default RequestAccess;
