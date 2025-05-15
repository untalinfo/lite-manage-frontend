import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Input, Button, Typography, Alert, Spin } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { LoginFormInputs } from "../../helpers/types";

const { Title } = Typography;



const LoginForm: React.FC = () => {
  const { login, isLoading: authIsLoading } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      pass: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoginError(null);
    const result = await login(data.email, data.pass);
    if (result.success) {
      navigate("/admin/dashboard"); // O la ruta principal del admin
    } else {
      setLoginError(result.message || "Error al iniciar sesión.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 50 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Iniciar Sesión en LiteManage
      </Title>
      {loginError && (
        <Alert
          message={loginError}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
        <Form.Item
          label="Correo Electrónico"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: "El correo es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electrónico inválido",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined />}
                placeholder="ejemplo@correo.com"
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          validateStatus={errors.pass ? "error" : ""}
          help={errors.pass?.message}
        >
          <Controller
            name="pass"
            control={control}
            rules={{ required: "La contraseña es obligatoria" }}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder="Contraseña"
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting || authIsLoading}
            block
            size="large"
          >
            {isSubmitting || authIsLoading ? <Spin /> : "Ingresar"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
