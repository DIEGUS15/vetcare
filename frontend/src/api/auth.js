import axiosInstance from "./axios.js";

export const loginRequest = (credentials) =>
  axiosInstance.post(`/login`, credentials);

export const verifyTokenRequest = () => axiosInstance.get("/verify");

export const logoutRequest = () => axiosInstance.post("/logout");
