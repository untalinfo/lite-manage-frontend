export interface User {
  id: string;
  email: string;
  role: 'Administrador' | 'Externo'; // Ajusta los roles según necesidad
  name?: string;
}

export interface LoginFormInputs {
  email: string;
  pass: string;
}

export interface Company {
  id: string;
  nit: string; // Llave primaria
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface Product {
  id: string;
  codigo: string; // Llave primaria (en el contexto de este producto)
  nombre: string;
  caracteristicas: string;
  precioEnVariasMonedas: string; // Ejemplo: "USD:10,EUR:9,COP:40000"
  empresaId: string; // FK a Company
  empresa?: Company; // Opcional, para mostrar el nombre de la empresa
}

// Para los formularios, a menudo no incluimos el 'id' al crear
export type CompanyFormData = Omit<Company, 'id'>;
export type ProductFormData = Omit<Product, 'id' | 'empresa'>; // Quitamos 'empresa' también si solo manejamos empresaId