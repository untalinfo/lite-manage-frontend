import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spin, Layout } from "antd"; // Para mostrar un loader mientras se verifica auth

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Muestra un spinner mientras se verifica el estado de autenticación
    return (
      <Layout
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </Layout>
    );
  }

  if (!isAuthenticated) {
    // Redirige al login, guardando la ubicación actual para volver después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Si está autenticado, renderiza el contenido de la ruta hija
};

export default ProtectedRoute;
