import React, { useEffect, useState } from "react";
import { List, Card, Typography, Spin, Input, message } from "antd";
import { ShopOutlined } from "@ant-design/icons"; // O TeamOutlined
import { getCompanies } from "../services/companyService";
import type { Company } from "../helpers/types"; // Asegúrate que la ruta sea correcta

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const PublicCompaniesPage: React.FC = () => {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPublicCompanies = async () => {
      setIsLoading(true);
      try {
        const data = await getCompanies();
        setAllCompanies(data);
        setFilteredCompanies(data); // Inicialmente mostrar todas
      } catch (error) {
        console.error("Error fetching public companies:", error);
        message.error("Error al cargar la lista de empresas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicCompanies();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCompanies(allCompanies);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filteredData = allCompanies.filter(
        (company) =>
          company.nombre.toLowerCase().includes(lowercasedFilter) ||
          company.nit.toLowerCase().includes(lowercasedFilter) ||
          company.direccion.toLowerCase().includes(lowercasedFilter)
      );
      setFilteredCompanies(filteredData);
    }
  }, [searchTerm, allCompanies]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Nuestras Empresas Asociadas
      </Title>
      <Paragraph style={{ textAlign: "center", marginBottom: 32 }}>
        Explora el catálogo de empresas que forman parte de nuestra red.
      </Paragraph>

      <Search
        placeholder="Buscar empresas por nombre, NIT o dirección..."
        onSearch={(value) => setSearchTerm(value)}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: 24,
          maxWidth: 600,
          margin: "0 auto 24px auto",
          display: "block",
        }}
        enterButton
        size="large"
      />

      {filteredCompanies.length === 0 && !isLoading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <ShopOutlined style={{ fontSize: 48, color: "#ccc" }} />
          <Title level={4} style={{ color: "#aaa", marginTop: 16 }}>
            {searchTerm
              ? "No se encontraron empresas con ese criterio."
              : "Aún no hay empresas registradas."}
          </Title>
        </div>
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={filteredCompanies}
          renderItem={(company) => (
            <List.Item>
              <Card
                hoverable
                title={
                  <>
                    <ShopOutlined style={{ marginRight: 8 }} /> {company.nombre}
                  </>
                }
                // actions={[<Button type="link">Ver Detalles</Button>]} // Si tuvieras una página de detalle
              >
                <Paragraph>
                  <Text strong>NIT:</Text> {company.nit}
                </Paragraph>
                <Paragraph>
                  <Text strong>Dirección:</Text> {company.direccion}
                </Paragraph>
                <Paragraph>
                  <Text strong>Teléfono:</Text> {company.telefono}
                </Paragraph>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default PublicCompaniesPage;
