import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Typography,
  Spin,
  List,
  message,
  Avatar,
} from "antd";
import { Link } from "react-router-dom";
import {
  TeamOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { getCompanies } from "../services/companyService";
import { getProducts } from "../services/productService";
import type { Company, Product } from "../helpers/types"; // Asegúrate que la ruta sea correcta

// Si decides incluir un gráfico aquí:
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title } = Typography;

const AdminDashboardPage: React.FC = () => {
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  // Datos para el gráfico (si lo incluyes)
  const [productsByCompanyData, setProductsByCompanyData] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const companiesData = await getCompanies();
        const productsData = await getProducts();

        setTotalCompanies(companiesData.length);
        setTotalProducts(productsData.length);

        // Simular actividad reciente (ej. las últimas 3 añadidas - nuestros mocks no tienen fecha de creación, así que tomamos las últimas del array)
        setRecentCompanies(companiesData.slice(-3).reverse());
        setRecentProducts(productsData.slice(-3).reverse());

        // Procesar datos para el gráfico (si se usa)
        const companyProductCounts: { [key: string]: number } = {};
        productsData.forEach(product => {
          const companyName = product.empresa?.nombre || 'Desconocida';
          companyProductCounts[companyName] = (companyProductCounts[companyName] || 0) + 1;
        });
        const chartData = Object.entries(companyProductCounts).map(([name, count]) => ({ name, productos: count }));
        setProductsByCompanyData(chartData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        message.error('Error al cargar datos del dashboard'); // Opcional
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 200px)",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
        }}
      >
        <Title level={2} style={{ marginBottom: 24 }}>
          Dashboard de Administración
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total de Empresas"
                value={totalCompanies}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <Statistic
                title="Total de Productos"
                value={totalProducts}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Title level={3} style={{ marginTop: 32, marginBottom: 16 }}>
          Accesos Rápidos
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Link to="/admin/empresas">
              <Button type="primary" icon={<TeamOutlined />} size="large" block>
                Gestionar Empresas
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Link to="/admin/productos">
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                block
              >
                Gestionar Productos
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Link to="/admin/inventario">
              <Button
                type="primary"
                icon={<AppstoreOutlined />}
                size="large"
                block
              >
                Ver Inventario
              </Button>
            </Link>
          </Col>
        </Row>

        {/* Sección de Gráfico Opcional */}
        <Title level={3} style={{ marginTop: 32, marginBottom: 16 }}>
          Productos por Empresa
        </Title>
        <Card>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productsByCompanyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="productos" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Row gutter={[16, 32]} style={{ marginTop: 32 }}>
          <Col xs={24} md={12}>
            <Title level={4}>Empresas Recientes</Title>
            <List
              itemLayout="horizontal"
              dataSource={recentCompanies}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<TeamOutlined />} />}
                    title={<Link to={`/admin/empresas`}>{item.nombre}</Link>} // Podrías enlazar a una vista de detalle si existiera
                    description={`NIT: ${item.nit}`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: "No hay empresas recientes." }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>Productos Recientes</Title>
            <List
              itemLayout="horizontal"
              dataSource={recentProducts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<ShoppingCartOutlined />} />}
                    title={<Link to={`/admin/productos`}>{item.nombre}</Link>}
                    description={`Código: ${item.codigo} - Empresa: ${
                      item.empresa?.nombre || "N/A"
                    }`}
                  />
                </List.Item>
              )}
              locale={{ emptyText: "No hay productos recientes." }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
