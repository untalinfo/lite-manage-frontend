import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Verifica si el usuario está autenticado

  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/admin/dashboard"); // Redirige al dashboard si está autenticado
    } else {
      navigate("/"); // Redirige a la página de inicio si no está autenticado
    }
  };

  return (
    <Result
      status="404"
      title={<span style={{ color: "white" }}>404</span>}
      subTitle={
        <span style={{ color: "white" }}>
          Lo sentimos, la página que buscas no existe.
        </span>
      }
      extra={
        <Button type="primary" onClick={handleRedirect}>
          Volver al Inicio
        </Button>
      }
    />
  );
};

export default NotFoundPage;
