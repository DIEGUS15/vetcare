import axiosInstance from "./axios.js";

//Obtener usuarios con paginación
export const getUsersRequest = (page = 1, limit = 5) =>
  axiosInstance.get(`/users?page=${page}&limit=${limit}`);

//Crear usuario
export const createUserRequest = (user) =>
  axiosInstance.post(`/register`, user);

export const updateUserRequest = (userId, user) =>
  axiosInstance.put(`/users/${userId}`, user);
