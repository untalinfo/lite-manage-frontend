import React from "react";
import { Layout } from "antd"; // Para un layout simple si es necesario
import LoginForm from "../components/organisms/LoginFrom";

const { Content } = Layout;

const LoginPage: React.FC = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Content>
        <LoginForm />
      </Content>
    </Layout>
  );
};

export default LoginPage;
