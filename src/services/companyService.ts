import type { Company, CompanyFormData } from "../helpers/types";


// Simulación de base de datos en memoria
let mockCompanies: Company[] = [
  { id: 'comp1', nit: '123-456-789', nombre: 'Empresa Alfa Tech', direccion: 'Calle Falsa 123, Ciudad Demo', telefono: '555-0101' },
  { id: 'comp2', nit: '987-654-321', nombre: 'Soluciones Beta Global', direccion: 'Avenida Siempreviva 742, Villa Test', telefono: '555-0202' },
  { id: 'comp3', nit: '111-222-333', nombre: 'Innovaciones Gamma SAS', direccion: 'Carrera Ejemplo 45-67, Metrópolis Prueba', telefono: '555-0303' },
];

// Simula un delay de API
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getCompanies = async (): Promise<Company[]> => {
  await delay(300);
  return [...mockCompanies]; // Devuelve una copia para evitar mutaciones directas
};

export const getCompanyById = async (id: string): Promise<Company | undefined> => {
  await delay(200);
  return mockCompanies.find(c => c.id === id);
};

export const createCompany = async (companyData: CompanyFormData): Promise<Company> => {
  await delay(400);
  const newCompany: Company = { ...companyData, id: `comp${Date.now()}` };
  mockCompanies.push(newCompany);
  return newCompany;
};

export const updateCompany = async (id: string, companyData: Partial<CompanyFormData>): Promise<Company | undefined> => {
  await delay(400);
  const companyIndex = mockCompanies.findIndex(c => c.id === id);
  if (companyIndex > -1) {
    mockCompanies[companyIndex] = { ...mockCompanies[companyIndex], ...companyData };
    return mockCompanies[companyIndex];
  }
  return undefined;
};

export const deleteCompany = async (id: string): Promise<boolean> => {
  await delay(300);
  const initialLength = mockCompanies.length;
  mockCompanies = mockCompanies.filter(c => c.id !== id);
  return mockCompanies.length < initialLength;
};