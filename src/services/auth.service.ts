import { apiFetch } from './api';

export const authService = {
  async login(email: string, password: string): Promise<any> {
    return await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      requireAuth: false
    });
  },

  async eliminarCuenta(): Promise<any> {
    return await apiFetch('/auth/eliminar-cuenta', {
      method: 'DELETE',
    });
  },

  async actualizarPerfil(datos: FormData | any): Promise<any> {
    return await apiFetch('/auth/actualizar-perfil', {
      method: 'PUT',
      body: datos instanceof FormData ? datos : JSON.stringify(datos)
    });
  }
};
