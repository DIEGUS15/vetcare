import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { signin, isAuthenticated, errors: signinErrors, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSumitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/pruebita");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar errores del campo cuando el usuario empiece a escribir
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "El email es requerido";
    if (!formData.password) errors.password = "La contraseña es requerida";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        await signin(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Cargando...</h2>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-form-container">
        {signinErrors.map((error, i) => (
          <div className="error-message" key={i}>
            {error}
          </div>
        ))}

        <h1>Iniciar Sesión - VETCARE</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="form-input"
            disabled={isSumitting}
          />
          {formErrors.email && (
            <p className="error-text"> {formErrors.email} </p>
          )}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="form-input"
            disabled={isSumitting}
          />
          {formErrors.password && (
            <p className="error-text"> {formErrors.password} </p>
          )}

          <button type="submit" className="form-button" disabled={isSumitting}>
            {isSumitting ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
