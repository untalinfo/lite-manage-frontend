import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Space,
  Spin,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import type { Product, ProductFormData, Company } from "../helpers/types"; // Asegúrate que la ruta a types sea correcta
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { getCompanies } from "../services/companyService";

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

type ProductFormFields = ProductFormData & { empresaId: string };

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formAntd] = Form.useForm(); // Instancia de Ant Design Form

  const defaultValues: ProductFormFields = {
    codigo: "",
    nombre: "",
    caracteristicas: "",
    precioEnVariasMonedas: "",
    empresaId: "", // Es importante tenerlo aquí aunque sea un Select
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormFields>({
    defaultValues
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      message.error(`Error al cargar los productos: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompaniesForSelect = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      message.error(
        `Error al cargar lista de empresas para el selector: ${errorMessage}`
      );
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCompaniesForSelect();
  }, []);

  const showModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      const formData = {
        ...product,
        empresaId: product.empresaId || "", // Asegura que empresaId siempre sea string
      };
      reset(formData); // Resetea RHF con los valores del producto
      formAntd.setFieldsValue(formData); // Opcional: para AntD visual
    } else {
      setEditingProduct(null);
      reset(defaultValues); // Resetea RHF a los defaultValues
      formAntd.resetFields(); // Opcional: para AntD visual
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    reset();
    formAntd.resetFields();
  };

  const onFinish = async (values: ProductFormFields) => {
    console.log("Valores del formulario de Producto (RHF):", values); // DEBUGGING
    if (!values.codigo || !values.nombre || !values.empresaId) {
      message.error("Faltan datos obligatorios (Código, Nombre o Empresa).");
      return;
    }
    setIsLoading(true);
    // La desestructuración de 'empresaId' ya la tienes, lo que es correcto.
    // solo asegúrate que 'createProduct' reciba 'values' y luego extraiga empresaId si es necesario,
    // o que reciba 'productData' y 'empresaId' por separado.
    // Tu actual `createProduct(values, empresaId)` parece un poco redundante si `values` ya tiene `empresaId`.
    // Vamos a asumir que `createProduct` en el servicio toma `(productData, empresaId)`.
    const { empresaId } = values;

    try {
      if (editingProduct) {
        // Para update, pasamos el objeto completo 'values' ya que el servicio puede esperar empresaId dentro.
        await updateProduct(editingProduct.id, values);
        message.success("Producto actualizado con éxito");
      } else {
        // Para create, pasamos los datos del producto y el empresaId por separado si así lo espera el servicio.
        await createProduct(values, empresaId);
        message.success("Producto creado con éxito");
      }
      fetchProducts();
      setIsModalVisible(false); // Cierra el modal
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      message.error(
        editingProduct
          ? `Error al actualizar el producto: ${errorMessage}`
          : `Error al crear el producto: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteProduct(id);
      message.success("Producto eliminado con éxito");
      fetchProducts();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      message.error(`Error al eliminar el producto: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      sorter: (a: Product, b: Product) => a.codigo.localeCompare(b.codigo),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a: Product, b: Product) => a.nombre.localeCompare(b.nombre),
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
    {
      title: "Empresa",
      dataIndex: ["empresa", "nombre"],
      key: "empresaNombre",
      render: (_: string, record: Product) => record.empresa?.nombre || "N/A",
      sorter: (a: Product, b: Product) =>
        (a.empresa?.nombre || "").localeCompare(b.empresa?.nombre || ""),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            type="primary"
            ghost
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar este producto?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
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
        <Title level={3}>Gestión de Productos</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Añadir Producto
        </Button>
      </div>

      {isLoading && products.length === 0 ? (
        <Spin size="large" style={{ display: "block", marginTop: 50 }} />
      ) : (
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={isLoading}
        />
      )}

      <Modal
        title={editingProduct ? "Editar Producto" : "Añadir Nuevo Producto"}
        open={isModalVisible} // 'open' para AntD v5+
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
        width={600}
      >
        <Form
          form={formAntd}
          layout="vertical"
          onFinish={handleSubmit(onFinish)}
        >
          <Form.Item
            label="Código del Producto"
            help={errors.codigo?.message}
            validateStatus={errors.codigo ? "error" : ""}
          >
            <Controller
              name="codigo"
              control={control}
              rules={
                { required: {value: true, message: "Por favor ingrese el código"} }
              }
              render={({ field }) => (
                <Input {...field} disabled={!!editingProduct} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Nombre del Producto"
            help={errors.nombre?.message}
            validateStatus={errors.nombre ? "error" : ""}
          >
            <Controller
              name="nombre"
              control={control}
              rules={
                { required: {value:true, message: "Por favor ingrese el nombre"} }
              }
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Empresa"
            help={errors.empresaId?.message}
            validateStatus={errors.empresaId ? "error" : ""}
          >
            <Controller
              name="empresaId"
              control={control}
              rules={
                { required: {value:true, message: "Por favor seleccione una empresa"} }
              }
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Seleccione una empresa"
                  loading={companies.length === 0 && isLoading}
                >
                  {companies.map((comp) => (
                    <Option key={comp.id} value={comp.id}>
                      {comp.nombre}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Características"
            help={errors.caracteristicas?.message}
            validateStatus={errors.caracteristicas ? "error" : ""}
          >
            <Controller
              name="caracteristicas"
              control={control}
              rules={
                {
                  required: {value: true,
                  message: "Por favor ingrese las características"},
                }
              }
              render={({ field }) => <TextArea {...field} rows={3} />}
            />
          </Form.Item>

          <Form.Item
            label="Precio en Varias Monedas (ej: USD:10,EUR:9)"
            help={errors.precioEnVariasMonedas?.message}
            validateStatus={errors.precioEnVariasMonedas ? "error" : ""}
          >
            <Controller
              name="precioEnVariasMonedas"
              control={control}
              rules={
                { required: {value: true, message: "Por favor ingrese el precio"} }
              }
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {editingProduct ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
