import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/templates/AdminLayout";
import PublicLayout from "../components/templates/PublicLayout";
import AdminCompaniesPage from "../pages/AdminCompaniesPage";
import AdminProductsPage from "../pages/AdminProductsPage";
import AdminInventoryPage from "../pages/AdminInventoryPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import PublicCompaniesPage from "../pages/PublicCompaniesPage";


const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <PublicCompaniesPage />
            </PublicLayout>
          }
        />
        <Route
          path="/empresas-publico"
          element={
            <PublicLayout>
              <PublicCompaniesPage />
            </PublicLayout>
          }
        />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas de Administrador Protegidas */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {" "}
            {/* Layout para todas las rutas de admin */}
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="empresas" element={<AdminCompaniesPage />} />
            <Route path="productos" element={<AdminProductsPage />} />
            <Route path="inventario" element={<AdminInventoryPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />{" "}
            {/* Redirige /admin a /admin/dashboard */}
          </Route>
        </Route>

        {/* Ruta Catch-all para 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
