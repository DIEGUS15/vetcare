// src/pages/UsersPage.jsx
import { useState } from "react";
import { useUsers } from "../context/UserContext";
import "../styles/UsersPage.css";

const UsersPage = () => {
  const {
    users,
    pagination,
    loading,
    isCreating,
    errors,
    createUser,
    updateUser,
    goToPage,
    changeItemsPerPage,
    nextPage,
    prevPage,
    clearErrors,
  } = useUsers();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    cedula: "",
    telephone: "",
    address: "",
    role: "client",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setShowCreateForm(false);
      setFormData({
        fullname: "",
        cedula: "",
        telephone: "",
        address: "",
        role: "client",
        email: "",
        password: "",
      });
    } catch (error) {
      // Los errores se manejan en el context
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      fullname: user.fullname,
      cedula: user.cedula,
      telephone: user.telephone,
      address: user.address,
      role: user.role,
      email: user.email,
      password: "",
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      await updateUser(editingUser._id, updateData);
      setEditingUser(null);
      setFormData({
        fullname: "",
        cedula: "",
        telephone: "",
        address: "",
        role: "client",
        email: "",
        password: "",
      });
    } catch (error) {
      // Los errores se manejan en el context
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-text">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className={`btn btn-primary ${isCreating ? "btn-disabled" : ""}`}
          disabled={isCreating}
        >
          {isCreating ? "Creando..." : "Nuevo Usuario"}
        </button>
      </div>

      {/* Mostrar errores */}
      {errors.length > 0 && (
        <div className="error-container">
          <div className="error-content">
            <div className="error-messages">
              {errors.map((error, index) => (
                <p key={index} className="error-message">
                  {error}
                </p>
              ))}
            </div>
            <button onClick={clearErrors} className="error-close">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Controles de paginación superior */}
      <div className="pagination-controls-top">
        <div className="items-per-page">
          <span>Mostrar:</span>
          <select
            value={pagination.itemsPerPage}
            onChange={(e) => changeItemsPerPage(Number(e.target.value))}
            className="select-input"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>por página</span>
        </div>

        <div className="items-info">
          Mostrando {users.length} de {pagination.totalItems} usuarios
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="table-container">
        <table className="users-table">
          <thead className="table-header">
            <tr>
              <th className="table-th">Nombre</th>
              <th className="table-th">Email</th>
              <th className="table-th">Rol</th>
              <th className="table-th">Estado</th>
              <th className="table-th">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {users.map((user) => (
              <tr key={user._id} className="table-row">
                <td className="table-td">
                  <div className="user-info">
                    <div className="user-name">{user.fullname}</div>
                    <div className="user-cedula">{user.cedula}</div>
                  </div>
                </td>
                <td className="table-td table-email">{user.email}</td>
                <td className="table-td">
                  <span className="badge badge-role">{user.role}</span>
                </td>
                <td className="table-td">
                  <span
                    className={`badge ${
                      user.state === "active"
                        ? "badge-active"
                        : "badge-inactive"
                    }`}
                  >
                    {user.state}
                  </span>
                </td>
                <td className="table-td">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="btn-link"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación inferior */}
      <div className="pagination-controls-bottom">
        <div className="pagination-info">
          Página {pagination.currentPage} de {pagination.totalPages}
        </div>

        <div className="pagination-buttons">
          <button
            onClick={prevPage}
            disabled={!pagination.hasPreviousPage || loading}
            className="btn btn-pagination"
          >
            Anterior
          </button>

          {/* Números de página */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                disabled={loading}
                className={`btn btn-pagination ${
                  page === pagination.currentPage ? "btn-pagination-active" : ""
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={nextPage}
            disabled={!pagination.hasNextPage || loading}
            className="btn btn-pagination"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal/Form para crear/editar usuarios */}
      {(showCreateForm || editingUser) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {editingUser ? "Editar Usuario" : "Crear Usuario"}
            </h2>

            <form
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              className="user-form"
            >
              <div className="form-fields">
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                  className="form-input"
                  required
                />

                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  placeholder="Cédula"
                  className="form-input"
                  required
                />

                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="Teléfono"
                  className="form-input"
                />

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Dirección"
                  className="form-input"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="form-input"
                  required
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="client">Cliente</option>
                  <option value="veterinarian">Veterinario</option>
                  <option value="assistant">Asistente</option>
                  <option value="admin">Administrador</option>
                </select>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={
                    editingUser
                      ? "Nueva contraseña (dejar vacío para no cambiar)"
                      : "Contraseña"
                  }
                  className="form-input"
                  required={!editingUser}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingUser(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${
                    isCreating ? "btn-disabled" : ""
                  }`}
                  disabled={isCreating}
                >
                  {editingUser ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
