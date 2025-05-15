
import type { Product, ProductFormData } from '../helpers/types';
import { getCompanies } from './companyService'; // Para obtener nombres de empresas

let mockProducts: Product[] = [
  { id: 'prod1', codigo: 'P001', nombre: 'Laptop Pro X', caracteristicas: '16GB RAM, 512GB SSD, Core i7', precioEnVariasMonedas: 'USD:1200,EUR:1100', empresaId: 'comp1' },
  { id: 'prod2', codigo: 'P002', nombre: 'Monitor Curvo 27"', caracteristicas: 'QHD, 144Hz, 1ms respuesta', precioEnVariasMonedas: 'USD:350,EUR:320', empresaId: 'comp1' },
  { id: 'prod3', codigo: 'S001', nombre: 'Software de Gestión Contable', caracteristicas: 'Suscripción anual, multiusuario', precioEnVariasMonedas: 'USD:500,EUR:450', empresaId: 'comp2' },
  { id: 'prod4', codigo: 'H001', nombre: 'Teclado Mecánico RGB', caracteristicas: 'Switches Blue, retroiluminado', precioEnVariasMonedas: 'USD:80,EUR:75', empresaId: 'comp3' },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getProducts = async (): Promise<Product[]> => {
  await delay(300);
  // Opcional: Enriquecer con nombre de empresa si es necesario directamente aquí
  // o hacerlo en el componente que consume este servicio
  const companies = await getCompanies();
  const productsWithCompanyNames = mockProducts.map(p => {
    const company = companies.find(c => c.id === p.empresaId);
    return { ...p, empresa: company };
  });
  return [...productsWithCompanyNames];
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(200);
  const product = mockProducts.find(p => p.id === id);
  if (product) {
    const companies = await getCompanies();
    const company = companies.find(c => c.id === product.empresaId);
    return { ...product, empresa: company };
  }
  return undefined;
};

export const createProduct = async (productData: ProductFormData, empresaId: string): Promise<Product> => {
  await delay(400);
  const newProduct: Product = { ...productData, empresaId, id: `prod${Date.now()}` };
  mockProducts.push(newProduct);
  const companies = await getCompanies();
  const company = companies.find(c => c.id === newProduct.empresaId);
  return { ...newProduct, empresa: company };
};

export const updateProduct = async (id: string, productData: Partial<ProductFormData & { empresaId?: string }>): Promise<Product | undefined> => {
  await delay(400);
  const productIndex = mockProducts.findIndex(p => p.id === id);
  if (productIndex > -1) {
    mockProducts[productIndex] = { ...mockProducts[productIndex], ...productData };
    const updatedProduct = mockProducts[productIndex];
    const companies = await getCompanies();
    const company = companies.find(c => c.id === updatedProduct.empresaId);
    return { ...updatedProduct, empresa: company };
  }
  return undefined;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  await delay(300);
  const initialLength = mockProducts.length;
  mockProducts = mockProducts.filter(p => p.id !== id);
  return mockProducts.length < initialLength;
};