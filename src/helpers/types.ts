export interface User {
  id: string;
  email: string;
  role: 'Administrador' | 'Externo'; // Ajusta los roles según necesidad
  name?: string;
}