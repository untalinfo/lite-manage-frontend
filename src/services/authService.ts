import type { User } from "../helpers/types";

// Simula un delay de API
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Datos mock del administrador
const mockAdminUser: User = {
  id: 'admin001',
  email: 'admin@litemanage.com',
  role: 'Administrador',
  name: 'Admin User'
};

export const loginUser = async (email: string, pass: string): Promise<{ success: boolean; user?: User; message?: string }> => {
  await delay(500); // Simula latencia de red

  // Lógica de autenticación MOCK muy simple
  // En un backend real, aquí se verificaría la contraseña (hasheada) contra la base de datos
  if (email.toLowerCase() === mockAdminUser.email && pass === 'admin123') { // ¡Contraseña en texto plano SOLO para mock!
    return { success: true, user: mockAdminUser };
  } else {
    return { success: false, message: 'Credenciales inválidas. Intente con admin@litemanage.com y admin123' };
  }
};