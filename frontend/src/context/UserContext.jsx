import { createContext, useContext, useState, useEffect } from "react";
import {
  getUsersRequest,
  createUserRequest,
  updateUserRequest,
} from "../api/users";

export const UserContext = createContext();

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  //Estado para los usuarios y paginación
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 5,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  //Estados de control
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getUsers = async (page = 1, limit = 5) => {
    try {
      setLoading(true);
      setErrors([]);

      const res = await getUsersRequest(page, limit);

      if (res.data.success) {
        setUsers(res.data.data);
        setPagination(res.data.pagination);
      } else {
        throw new Error(res.data.message || "Error al obtener usuarios");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error inesperado al obtener usuarios";
      setErrors([errorMessage]);

      //En caso de error, mantener estado limpio
      setUsers([]);
      setPagination((prev) => ({ ...prev, totalItems: 0, totalPages: 0 }));
    } finally {
      setLoading(false);
    }
  };

  //Función para ir a una página específica
  const goToPage = async (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      await getUsers(page, pagination.itemsPerPage);
    }
  };

  //Función para cambiar el límite de elementos por página
  const changeItemsPerPage = async (newLimit) => {
    await getUsers(1, newLimit);
  };

  const createUser = async (userData) => {
    try {
      setIsCreating(true);
      setErrors([]);

      const res = await createUserRequest(userData);

      //Recarga la página actual después de crear
      await getUsers(pagination.currentPage, pagination.itemsPerPage);
      return res.data;
    } catch (error) {
      console.error("Error creating user:", error);

      let errorMessages = [];
      if (Array.isArray(error.response?.data)) {
        errorMessages = error.response.data;
      } else if (error.response?.data?.message) {
        errorMessages = [error.response.data.message];
      } else {
        errorMessages = ["Error al crear usuario"];
      }

      setErrors(errorMessages);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      setIsUpdating(true);
      setErrors([]);

      const res = await updateUserRequest(userId, userData);

      //Recargar la página actual después de actualizar
      await getUsers(pagination.currentPage, pagination.itemsPerPage);

      return res.data;
    } catch (error) {
      console.error("Error updating user:", error);

      let errorMessages = [];
      if (error.response?.data?.message) {
        errorMessages = [error.response.data.message];
      } else {
        errorMessages = ["Error al actualizar usuario"];
      }

      setErrors(errorMessages);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  //Función para limpiar errores manualmente
  const clearErrors = () => {
    setErrors([]);
  };

  //Cargar los usuarios al montar el componente
  useEffect(() => {
    getUsers(1, 5);
  }, []);

  //Limpiar errores automáticamente después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const value = {
    //Datos
    users,
    pagination,

    //Estados
    loading,
    isCreating,
    isUpdating,
    errors,

    //Funciones
    getUsers,
    goToPage,
    changeItemsPerPage,
    createUser,
    updateUser,
    clearErrors,

    //Funciones de conveniencia para paginación
    nextPage: () => goToPage(pagination.currentPage + 1),
    prevPage: () => goToPage(pagination.currentPage - 1),
    firstPage: () => goToPage(1),
    lastPage: () => goToPage(pagination.totalPages),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
