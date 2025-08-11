import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // ✅ Esto envía las cookies automáticamente
});

// Response interceptor simplificado (sin refresh - lo maneja tu API Gateway)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si recibimos 401 o 403, significa que el refresh también falló
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Authentication failed - redirecting to login");

      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3000/api",
//   withCredentials: true,
// });

// // Interceptor para manejar refresh de tokens automáticamente
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Si es 401 y no hemos intentado refresh
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Intentar refresh automático
//         await axiosInstance.post("/refresh-token");
//         // Reintentar la petición original
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // Si falla el refresh, redirigir al login
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
