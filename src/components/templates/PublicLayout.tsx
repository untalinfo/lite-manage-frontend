import React, { type ReactNode } from "react";
import { Layout, Menu, Typography } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <Title
            level={3}
            style={{ color: "white", margin: 0, lineHeight: "64px" }}
          >
            LiteManage
          </Title>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ marginLeft: "auto" }}
        >
          <Menu.Item key="1">
            <Link to="/empresas-publico">Empresas</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/login">Admin Login</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px", marginTop: "20px" }}>
        <div
          className="site-layout-content"
          style={{ background: "#fff", padding: 24, minHeight: 280 }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        LiteManage ©{new Date().getFullYear()} La plataforma moderna para una
        administración empresarial ágil
      </Footer>
    </Layout>
  );
};

export default PublicLayout;
