import axios from "axios";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const createRequest = (softwareId, accessType, reason) => {
  return axios.post(
    "/api/requests",
    { softwareId, accessType, reason },
    getAuthHeader()
  );
};

export const getPendingRequests = () => {
  return axios.get("/api/requests/pending", getAuthHeader());
};

export const updateRequestStatus = (id, status) => {
  return axios.patch(`/api/requests/${id}`, { status }, getAuthHeader());
};

export const getUserRequests = () => {
  return axios.get("/api/requests/my", getAuthHeader());
};
