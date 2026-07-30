import { apiFetch } from './api';

export const donanteService = {
  async getDonaciones(): Promise<any[]> {
    return await apiFetch<any[]>('/donante/donaciones', { method: 'GET' });
  },

  async crearDonacion(formData: FormData): Promise<any> {
    return await apiFetch('/donante/donaciones', {
      method: 'POST',
      body: formData,
    });
  },

  async validarRetiro(codigo: string): Promise<any> {
    return await apiFetch('/donante/donaciones/validar-retiro', {
      method: 'POST',
      body: JSON.stringify({ codigo }),
    });
  },

  async modificarDonacion(id: number, formData: FormData): Promise<any> {
    return await apiFetch(`/donante/donaciones/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  async eliminarDonacion(id: number): Promise<any> {
    return await apiFetch(`/donante/donaciones/${id}`, {
      method: 'DELETE',
    });
  }
};
