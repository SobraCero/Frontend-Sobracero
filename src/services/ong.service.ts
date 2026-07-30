import { apiFetch } from './api';

export const ongService = {
  async getCatalogo(): Promise<any[]> {
    return await apiFetch('/ong/catalogo', { method: 'GET' });
  },

  async getReservaActiva(): Promise<any> {
    return await apiFetch('/ong/reserva-activa', { method: 'GET' });
  },

  async crearReserva(donacionId: number): Promise<any> {
    return await apiFetch('/ong/reservas', {
      method: 'POST',
      body: JSON.stringify({ donacionId })
    });
  },

  async cancelarReserva(reservaId: number): Promise<any> {
    return await apiFetch(`/ong/reservas/${reservaId}`, { method: 'DELETE' });
  }
};
