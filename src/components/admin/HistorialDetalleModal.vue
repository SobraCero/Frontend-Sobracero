<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <div>
          <h3 class="text-xl font-bold text-gray-800">Detalle de Transacción</h3>
          <p class="text-xs text-gray-500">ID Registro Historial: #{{ registro.id }}</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        <h4 class="order-1 md:order-1 text-sm font-semibold uppercase tracking-wider text-green-600 border-b pb-1">Datos del Alimento / Donación</h4>
        <h4 class="order-4 md:order-2 text-sm font-semibold uppercase tracking-wider text-blue-600 border-b pb-1">Seguimiento de Entrega</h4>

        <div class="order-2 md:order-3 bg-gray-50 p-4 rounded-lg space-y-3 h-full">
          <div>
            <span class="block text-xs font-medium text-gray-400">Producto / Donación:</span>
            <span class="text-base font-semibold text-gray-800">{{ registro.donacionNombre }}</span>
          </div>
          <div v-if="registro.descripcion">
            <span class="block text-xs font-medium text-gray-400">Descripción:</span>
            <span class="text-sm text-gray-600">{{ registro.descripcion }}</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <span class="block text-xs font-medium text-gray-400">Cantidad / Kilos:</span>
              <span class="text-sm font-bold text-gray-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">{{ registro.cantidadPorciones }} Kgs/Porciones</span>
            </div>
            <div>
              <span class="block text-xs font-medium text-gray-400">Vencimiento Máx:</span>
              <span class="text-sm font-medium text-gray-700">{{ formatFecha(registro.horaLimiteRetiro) }}</span>
            </div>
          </div>
        </div>

        <div class="order-5 md:order-4 bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4 h-full">
          <div>
            <span class="block text-xs font-medium text-gray-400">Organización Donante:</span>
            <span class="text-sm font-semibold text-gray-800">{{ registro.donanteNombre }}</span>
          </div>
          <div>
            <span class="block text-xs font-medium text-gray-400">ONG Receptora:</span>
            <span class="text-sm font-semibold text-gray-800">{{ registro.ongNombre }}</span>
          </div>
          <div>
            <span class="block text-xs font-medium text-gray-400">Código de Retiro:</span>
            <span class="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{{ registro.codigoRetiro }}</span>
          </div>
          <div>
            <span class="block text-xs font-medium text-gray-400">Fecha y Hora Entrega:</span>
            <span class="text-sm font-medium text-gray-700">{{ formatFecha(registro.fechaCambio) }}</span>
          </div>
        </div>

        <div class="order-3 md:order-5">
          <span class="block text-xs font-medium text-gray-400 mb-2">Imagen de la Donación:</span>
          <div class="border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-48 shadow-sm">
            <img
                v-if="registro.imagenUrl"
                :src="`/imagenes-sobracero/${registro.imagenUrl}`"
                alt="Imagen Alimento"
                class="w-full h-full object-cover"
            />
            <div v-else class="text-gray-400 text-sm flex flex-col items-center">
              <svg class="w-12 h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Sin imagen adjunta
            </div>
          </div>
        </div>

        <div class="order-6 md:order-6">
          <div class="flex items-center justify-between mb-1">
            <span class="block text-xs font-medium text-gray-400">Lugar de Retiro (Dirección Donante):</span>
            <span class="text-xs font-semibold text-gray-600 truncate max-w-[200px]">{{ registro.ubicacionDonante }}</span>
          </div>

          <div class="border rounded-lg overflow-hidden shadow-sm h-48 bg-gray-100">
            <iframe
                v-if="registro.ubicacionDonante && registro.ubicacionDonante !== 'N/A'"
                width="100%"
                height="100%"
                frameborder="0"
                scrolling="no"
                marginheight="0"
                marginwidth="0"
                :src="`https://maps.google.com/maps?q=${encodeURIComponent(registro.ubicacionDonante)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`"
            ></iframe>
            <div v-else class="h-full flex items-center justify-center text-gray-400 text-sm">
              Dirección no disponible para el mapa
            </div>
          </div>
        </div>

      </div>

      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end rounded-b-xl">
        <button
            @click="$emit('close')"
            class="px-5 py-2 bg-gray-800 text-white rounded-lg font-medium shadow hover:bg-gray-700 transition-colors text-sm"
        >
          Entendido
        </button>
      </div>

    </div>
  </div>
</template>

<script setup class="text-sm">
import { defineProps, defineEmits } from 'vue';

defineProps({
  isOpen: Boolean,
  registro: Object
});

defineEmits(['close']);

const formatFecha = (fechaStr) => {
  if (!fechaStr) return 'N/A';
  try {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return fechaStr;
  }
};
</script>