<template>
  <GenericModal :isOpen="isOpen" @close="$emit('close')" maxWidthClass="max-w-5xl">

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2" v-if="donacion">

      <!-- Columna Izquierda: Detalles del Alimento (5 de 12 columnas) -->
      <div class="lg:col-span-5 space-y-5">
        <img :src="donacion.imagen" class="w-full h-60 object-cover rounded-2xl shadow-sm border border-stone-100" />

        <div class="flex justify-between items-start">
          <h3 class="text-2xl font-black text-emerald-900 leading-tight pr-4">{{ donacion.tipo }}</h3>
          <span :class="badgeClass">{{ donacion.estado }}</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100 shadow-sm">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Cantidad</p>
            <p class="font-bold text-stone-700 text-lg">{{ donacion.kilos }} kg/porc.</p>
          </div>
          <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100 shadow-sm">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Vencimiento</p>
            <p class="font-bold text-stone-700 text-lg">{{ donacion.vencimiento }}</p>
          </div>
        </div>

        <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100 shadow-sm">
          <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Ubicación</p>
          <p class="font-bold text-stone-700">{{ donacion.ubicacion }}</p>
        </div>

        <!-- BLOQUE: Detalles de Entrega (Mejorado tipográficamente) -->
        <div v-if="donacion.estado === 'entregado'" class="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 mt-2 shadow-sm">
          <h4 class="text-xs font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4" /> Detalle de Retiro
          </h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center border-b border-emerald-200/60 pb-2">
              <span class="text-[11px] font-bold text-emerald-800/70 uppercase tracking-wider">Receptor (ONG):</span>
              <span class="text-sm font-black text-stone-800">{{ donacion.ong }}</span>
            </div>
            <div class="flex justify-between items-center border-b border-emerald-200/60 pb-2">
              <span class="text-[11px] font-bold text-emerald-800/70 uppercase tracking-wider">Fecha y Hora:</span>
              <span class="text-sm font-bold text-stone-800">{{ formatFecha(donacion.fechaEntrega) }}</span>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="text-[11px] font-bold text-emerald-800/70 uppercase tracking-wider">Código Autorizado:</span>
              <span class="text-sm font-mono font-black text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-sm">{{ donacion.codigoRetiro }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Columna Derecha: Mapa Leaflet (7 de 12 columnas) -->
      <div class="lg:col-span-7 flex flex-col h-full min-h-[400px] lg:min-h-[550px]">
        <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Ubicación de Retiro en el Mapa</p>
        <div class="flex-1 rounded-3xl border-2 border-stone-200 overflow-hidden relative shadow-md">
          <div :id="mapId" class="absolute inset-0 z-0"></div>
        </div>
      </div>

    </div>
  </GenericModal>
</template>

<script setup lang="ts">
import GenericModal from '../common/GenericModal.vue';
import { CheckCircleIcon } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  donacion: any;
  badgeClass: string;
  mapId: string;
}>();

defineEmits(['close']);

const formatFecha = (fechaStr: string) => {
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