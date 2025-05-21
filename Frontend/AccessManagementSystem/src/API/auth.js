import axios from "axios";

export const signup = (username, password) => {
  return axios.post("/api/auth/signup", { username, password });
};

export const login = (username, password) => {
  return axios.post("/api/auth/login", { username, password });
};

export const createAdmin = (username, password, masterKey) => {
  return axios.post("/api/create-admin", { username, password, masterKey });
};
export const createManager = (username, password, masterKey) => {
  return axios.post("/api/create-manager", { username, password, masterKey });
};
