import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
import {
  DashboardOutlined,
  ShopOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: <Link to="/admin/empresas">Empresas</Link>,
    },
    {
      key: "3",
      icon: <ShopOutlined />,
      label: <Link to="/admin/productos">Productos</Link>,
    },
    {
      key: "4",
      icon: <ShopOutlined />,
      label: <Link to="/admin/inventario">Inventario</Link>,
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Perfil (N/A)
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: "32px",
            margin: "16px",
            background: "rgba(255, 255, 255, 0.2)",
            textAlign: "center",
            lineHeight: "32px",
            color: "white",
            borderRadius: "6px",
          }}
        >
          {collapsed ? "LM" : "LiteManage"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "black", // O el color que prefieras para el icono
            }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 8 }}>{user?.email}</span>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
          }}
        >
          <Outlet /> {/* Aquí se renderizarán las páginas de admin */}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          LiteManage Admin ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
