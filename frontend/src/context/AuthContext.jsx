import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, verifyTokenRequest } from "../api/auth";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});

  const signin = async (credentials) => {
    try {
      setErrors([]);
      const res = await loginRequest(credentials);
      console.log("Login response:", res.data);

      setIsAuthenticated(true);
      setUser(res.data.user);
    } catch (error) {
      console.error("Login error:", error);
      if (Array.isArray(error.response?.data)) {
        setErrors(error.response.data);
      } else {
        setErrors([error.response?.data?.message || "Error al iniciar sesión"]);
      }
    }
  };

  //Limpiar errores automáticamente después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    async function checkLogin() {
      try {
        console.log("Checking authentication...");
        const res = await verifyTokenRequest();
        console.log("Verify response:", res.data);

        if (res.data.valid && res.data.user) {
          setIsAuthenticated(true);
          setUser(res.data.user);
          console.log("User authenticated:", res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.log("Not authenticated:", error.response?.status);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  // useEffect(() => {
  //   async function checkLogin() {
  //     console.log("🍪 Document cookies:", document.cookie);
  //     // ✅ Verificación rápida: si no hay cookies, no hacer la llamada
  //     const hasToken = document.cookie.includes("accessToken");
  //     console.log("Has token check:", hasToken);

  //     if (!hasToken) {
  //       console.log("No access token found in cookies - skipping verification");
  //       setIsAuthenticated(false);
  //       setUser(null);
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       console.log("Checking authentication...");
  //       const res = await verifyTokenRequest();

  //       console.log("Verify response:", res.data);

  //       // ✅ Tu backend devuelve { valid: true, user: {...} }
  //       if (res.data.valid && res.data.user) {
  //         setIsAuthenticated(true);
  //         setUser(res.data.user);
  //         console.log("User authenticated:", res.data.user);
  //       } else {
  //         setIsAuthenticated(false);
  //         setUser(null);
  //       }
  //     } catch (error) {
  //       console.log("Not authenticated:", error.response?.status);
  //       setIsAuthenticated(false);
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   checkLogin();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        signin,
        // logout,
        loading,
        user,
        isAuthenticated,
        // profile,
        setIsAuthenticated,
        setUser,
        // getProfileInfo,
        errors,
        clearErrors: () => setErrors([]),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// import { createContext, useContext, useState, useEffect } from "react";
// import { loginRequest, verifyTokenRequest } from "../api/auth";

// export const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [errors, setErrors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState({});

//   const signin = async (credentials) => {
//     try {
//       setErrors([]);
//       const res = await loginRequest(credentials);
//       console.log("Login response:", res.data);

//       setIsAuthenticated(true);
//       setUser(res.data.user);
//     } catch (error) {
//       console.error("Login error:", error);
//       if (Array.isArray(error.response?.data)) {
//         setErrors(error.response.data);
//       } else {
//         setErrors([error.response?.data?.message || "Error al iniciar sesión"]);
//       }
//     }
//   };

//   //Limpiar errores automáticamente después de 5 segundos
//   useEffect(() => {
//     if (errors.length > 0) {
//       const timer = setTimeout(() => {
//         setErrors([]);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [errors]);

//   // Verificar autenticación al cargar la aplicación
//   useEffect(() => {
//     async function checkLogin() {
//       try {
//         // Con microservicios, no necesitamos verificar cookies manualmente
//         // El API Gateway maneja esto por nosotros
//         const res = await verifyTokenRequest();

//         if (res.data.user) {
//           setIsAuthenticated(true);
//           setUser(res.data.user);
//           //   await getProfileInfo();
//         } else {
//           setIsAuthenticated(false);
//           setUser(null);
//         }
//       } catch (error) {
//         console.log("Not authenticated:", error.response?.status);
//         console.log("Error details:", error.response?.data);
//         setIsAuthenticated(false);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     checkLogin();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         signin,
//         // logout,
//         loading,
//         user,
//         isAuthenticated,
//         // profile,
//         setIsAuthenticated,
//         setUser,
//         // getProfileInfo,
//         errors,
//         clearErrors: () => setErrors([]),
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
