import axios from "axios";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const createSoftware = (name, description, accessLevels) => {
  return axios.post(
    "/api/software",
    { name, description, accessLevels },
    getAuthHeader()
  );
};

export const getAllSoftware = () => {
  return axios.get("/api/software", getAuthHeader());
};
