import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Spin,
  Typography,
  Input,
  message,
  Modal,
  Form,
} from "antd";
import { DownloadOutlined, MailOutlined } from "@ant-design/icons";
import type { Product } from "../helpers/types";
import { getProducts } from "../services/productService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Asegúrate que esté importado para que .autoTable funcione

const { Title } = Typography;

const AdminInventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [emailForm] = Form.useForm();

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts(); // Reutilizamos getProducts
      setInventory(data);
    } catch (error) {
      const errorMessage =
              error instanceof Error ? error.message : "Error desconocido";
      message.error(`Error al cargar el inventario de productos: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);


  const handleDownloadPDF = () => {
    if (inventory.length === 0) {
      message.warning("No hay datos en el inventario para exportar.");
      return;
    }
    const doc = new jsPDF();

    doc.text("Inventario de Productos - LiteManage", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [
        [
          "Código",
          "Nombre",
          "Empresa",
          "Características",
          "Precio (Varias Monedas)",
        ],
      ],
      body: inventory.map((p) => [
        p.codigo,
        p.nombre,
        p.empresa?.nombre || "N/A",
        p.caracteristicas,
        p.precioEnVariasMonedas,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] }, // Un color para el header
      margin: { top: 20 },
    });
    doc.save("inventario_litemanage.pdf");
    message.success("PDF del inventario descargado.");
  };

  const showEmailModal = () => {
    if (inventory.length === 0) {
      message.warning("No hay inventario para enviar por correo.");
      return;
    }
    setIsEmailModalVisible(true);
  };

  const handleSendEmail = async (values: { email: string }) => {
    // Simulación de envío de PDF por email
    // En un proyecto real, aquí generarías el PDF (o tomarías el generado)
    // y lo enviarías a un endpoint backend que maneje el envío de correos.
    console.log(`Simulando envío de PDF a: ${values.email}`);
    // const pdfBlob = generatePdfBlob(); // Función que genera el PDF como Blob
    // await inventoryService.emailPdf(values.email, pdfBlob); // Llamada al servicio
    message.success(
      `PDF del inventario sería enviado a ${values.email} (simulado).`
    );
    setIsEmailModalVisible(false);
    emailForm.resetFields();
  };

  const columns = [
    { title: "Código", dataIndex: "codigo", key: "codigo" },
    { title: "Nombre Producto", dataIndex: "nombre", key: "nombre" },
    {
      title: "Empresa",
      dataIndex: ["empresa", "nombre"],
      key: "empresaNombre",
      render: (text: string, record: Product) =>
        record.empresa?.nombre || "N/A",
    },
    {
      title: "Características",
      dataIndex: "caracteristicas",
      key: "caracteristicas",
      ellipsis: true,
    },
    {
      title: "Precio (VM)",
      dataIndex: "precioEnVariasMonedas",
      key: "precioEnVariasMonedas",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={3}>Inventario de Productos</Title>
        <div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadPDF}
            style={{ marginRight: 8 }}
            disabled={inventory.length === 0}
          >
            Descargar PDF
          </Button>
          <Button
            icon={<MailOutlined />}
            onClick={showEmailModal}
            disabled={inventory.length === 0}
          >
            Enviar PDF por Email
          </Button>
        </div>
      </div>

      {isLoading && inventory.length === 0 ? (
        <Spin size="large" style={{ display: "block", marginTop: 50 }} />
      ) : (
        <Table
          dataSource={inventory}
          columns={columns}
          rowKey="id"
          loading={isLoading}
        />
      )}

      <Modal
        title="Enviar Inventario por Email"
        open={isEmailModalVisible}
        onCancel={() => setIsEmailModalVisible(false)}
        footer={null} // Footer personalizado abajo
      >
        <Form form={emailForm} layout="vertical" onFinish={handleSendEmail}>
          <Form.Item
            name="email"
            label="Correo Electrónico del Destinatario"
            rules={[
              {
                required: true,
                message: "Por favor ingrese un correo electrónico",
              },
              { type: "email", message: "El correo no es válido" },
            ]}
          >
            <Input placeholder="ejemplo@dominio.com" />
          </Form.Item>
          <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
            <Button
              onClick={() => setIsEmailModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Enviar (Simulado)
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminInventoryPage;
