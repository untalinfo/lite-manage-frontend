import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Spin,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form"; // <--- IMPORTANTE: Controller añadido
import type { Company, CompanyFormData } from "../helpers/types"; // Asegúrate que la ruta a types sea correcta
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/companyService";

const { Title } = Typography;

const AdminCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Instancia de Ant Design Form (opcional si RHF maneja todo, pero útil para form.resetFields())
  const [formAntd] = Form.useForm();

  const defaultValues = {
    nit: "",
    nombre: "",
    direccion: "",
    telefono: "",
  };

  // React Hook Form instance
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    defaultValues
  });

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      message.error(`Error al cargar las empresas: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const showModal = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      // Resetea RHF con los valores de la compañía a editar
      reset(company);
      // Opcional: si quieres que AntD form también se actualice visualmente de inmediato
      formAntd.setFieldsValue(company);
    } else {
      setEditingCompany(null);
      // Resetea RHF a los valores por defecto (vacíos definidos en useForm)
      reset(defaultValues);
      // Opcional: resetea también el form de AntD
      formAntd.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCompany(null);
    // No es estrictamente necesario resetear aquí si Modal tiene destroyOnClose/destroyOnHidden
    // pero por si acaso, o si quitas esas props del Modal:
    reset();
    formAntd.resetFields();
  };

  const onFinish = async (values: CompanyFormData) => {
    console.log("Valores del formulario (RHF) al enviar:", values); // DEBUGGING
    if (!values.nit || !values.nombre) {
      // Simple validación antes de enviar
      message.error("Faltan datos en el formulario (NIT o Nombre).");
      return;
    }
    setIsLoading(true);
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, values);
        message.success("Empresa actualizada con éxito");
      } else {
        await createCompany(values);
        message.success("Empresa creada con éxito");
      }
      fetchCompanies(); // Refresca la tabla
      setIsModalVisible(false); // Cierra el modal
      // handleCancel(); // Llama a handleCancel para resetear todo si es necesario
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      message.error(
        editingCompany
          ? `Error al actualizar la empresa: ${errorMessage}`
          : `Error al crear la empresa: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteCompany(id);
      message.success("Empresa eliminada con éxito");
      fetchCompanies();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      message.error(`Error al eliminar la empresa: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "NIT",
      dataIndex: "nit",
      key: "nit",
      sorter: (a: Company, b: Company) => a.nit.localeCompare(b.nit),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a: Company, b: Company) => a.nombre.localeCompare(b.nombre),
    },
    { title: "Dirección", dataIndex: "direccion", key: "direccion" },
    { title: "Teléfono", dataIndex: "telefono", key: "telefono" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: Company) => (
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
            title="¿Estás seguro de eliminar esta empresa?"
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
        <Title level={3}>Gestión de Empresas</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Añadir Empresa
        </Button>
      </div>

      {isLoading && companies.length === 0 ? (
        <Spin size="large" style={{ display: "block", marginTop: 50 }} />
      ) : (
        <Table
          dataSource={companies}
          columns={columns}
          rowKey="id"
          loading={isLoading}
        />
      )}

      <Modal
        title={editingCompany ? "Editar Empresa" : "Añadir Nueva Empresa"}
        open={isModalVisible} // 'open' es la prop correcta en AntD v5+ (antes 'visible')
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden //  'destroyOnClose' es mejor que 'destroyOnHidden' para resetear al cerrar
        // forceRender // Opcional: asegura que el contenido del modal se renderice incluso si está oculto
      >
        {/* 
          El prop 'form' en <Form> es para la instancia de AntD Form.
          RHF usa 'control' que se pasa a cada <Controller>.
          'handleSubmit(onFinish)' asegura que RHF maneje el submit.
        */}
        <Form
          form={formAntd}
          layout="vertical"
          onFinish={handleSubmit(onFinish)}
        >
          <Form.Item
            label="NIT"
            help={errors.nit?.message}
            validateStatus={errors.nit ? "error" : ""}
            // 'name' en Form.Item es opcional si Controller lo maneja, pero no hace daño
          >
            <Controller
              name="nit"
              control={control}
              rules={{ required: { value: true, message: "Por favor ingrese el NIT" } }}
              render={({ field }) => (
                <Input {...field} disabled={!!editingCompany} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Nombre de la Empresa"
            help={errors.nombre?.message}
            validateStatus={errors.nombre ? "error" : ""}
          >
            <Controller
              name="nombre"
              control={control}
              rules={{ required: {value: true, message: "Por favor ingrese el nombre"} }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Dirección"
            help={errors.direccion?.message}
            validateStatus={errors.direccion ? "error" : ""}
          >
            <Controller
              name="direccion"
              control={control}
              rules={{required: {value: true, message: "Por favor ingrese la dirección"}}}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            help={errors.telefono?.message}
            validateStatus={errors.telefono ? "error" : ""}
          >
            <Controller
              name="telefono"
              control={control}
              rules={{ required: {value: true, message: "Por favor ingrese el teléfono"} }}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {editingCompany ? "Guardar Cambios" : "Crear Empresa"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCompaniesPage;
