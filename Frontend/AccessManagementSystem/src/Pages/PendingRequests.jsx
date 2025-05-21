import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getPendingRequests, updateRequestStatus } from "../API/request";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const response = await getPendingRequests();

        setRequests(response.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch pending requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setLoading(true);
      await updateRequestStatus(requestId, newStatus);
      setRequests(requests.filter((request) => request.id !== requestId));
      setSuccess(`Request ${newStatus.toLowerCase()} successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update request status"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && requests.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pending Access Requests
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {requests.length === 0 ? (
          <Typography variant="body1">No pending requests found</Typography>
        ) : (
          <Grid container spacing={3}>
            {requests.map((request) => (
              <Grid item xs={12} key={request.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {request.software.name} - {request.accessType} Access
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Requested by:</strong> {request.user.username}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Reason:</strong> {request.reason}
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          handleStatusUpdate(request.id, "Approved")
                        }
                        disabled={loading}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleStatusUpdate(request.id, "Rejected")
                        }
                        disabled={loading}
                      >
                        Reject
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default PendingRequests;
