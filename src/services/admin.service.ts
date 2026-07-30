import { apiFetch } from './api';

export const adminService = {
  async getUsuarios(): Promise<any[]> {
    return await apiFetch('/admin/usuarios', { method: 'GET' });
  },

  async getDonaciones(): Promise<any[]> {
    return await apiFetch('/admin/donaciones', { method: 'GET' });
  },

  async getHistorial(): Promise<any[]> {
    return await apiFetch('/admin/donaciones/historial', { method: 'GET' });
  },

  async aprobarUsuario(id: number): Promise<any> {
    return await apiFetch(`/admin/usuarios/${id}/aprobar`, { method: 'PUT' });
  },

  async eliminarUsuario(id: number): Promise<any> {
    return await apiFetch(`/admin/usuarios/${id}`, { method: 'DELETE' });
  },

  async eliminarDonacion(id: number): Promise<any> {
    return await apiFetch(`/admin/donaciones/${id}`, { method: 'DELETE' });
  },

  async editarUsuario(id: number, formEdicion: any): Promise<any> {
    return await apiFetch(`/admin/usuarios/${id}/editar`, {
      method: 'PUT',
      body: JSON.stringify(formEdicion)
    });
  }
};
