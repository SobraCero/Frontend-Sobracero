<template>
  <GenericModal :isOpen="isOpen" @close="$emit('close')" maxWidthClass="max-w-4xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2" v-if="donacion">
      <div class="space-y-4">
        <img :src="donacion.imagenUrl || 'https://placehold.co/400x400/png'" class="w-full h-56 object-cover rounded-2xl shadow-sm border border-stone-100 mb-2" />
        <div class="flex justify-between items-start">
          <h3 class="text-2xl font-black text-slate-900 pr-8 leading-tight">{{ donacion.tipoAlimento || donacion.nombre }}</h3>
          <span :class="badgeClass">{{ donacion.estado }}</span>
        </div>
        <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100">
          <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Publicado por (Local)</p>
          <p class="font-bold text-stone-700 text-base">{{ donacion.donanteNombre || 'Local Donante' }}</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Cantidad</p>
            <p class="font-bold text-stone-700 text-lg">{{ donacion.cantidadPorciones }} kg</p>
          </div>
          <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Vencimiento</p>
            <p class="font-bold text-stone-700 text-lg">{{ donacion.horaLimiteRetiro ? donacion.horaLimiteRetiro.split('T')[0] : 'N/A' }}</p>
          </div>
        </div>
        <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100">
          <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Ubicación</p>
          <p class="font-bold text-stone-700">{{ donacion.ubicacion || 'Ubicación no especificada' }}</p>
        </div>
        <button @click="$emit('eliminar', donacion.id)" class="w-full mt-4 px-4 py-3 bg-red-50 text-red-600 border border-red-200 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors flex justify-center items-center gap-2">
          <TrashIcon class="w-5 h-5" /> Eliminar Publicación
        </button>
      </div>
      <div class="flex flex-col min-h-[400px]">
        <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Ubicación en el Mapa</p>
        <div class="flex-1 rounded-2xl border border-stone-200 overflow-hidden relative min-h-[360px] shadow-inner">
          <div :id="mapId" class="absolute inset-0"></div>
        </div>
      </div>
    </div>
  </GenericModal>
</template>

<script setup lang="ts">
import GenericModal from '../common/GenericModal.vue';
import { TrashIcon } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  donacion: any;
  badgeClass: string;
  mapId: string;
}>();

defineEmits(['close', 'eliminar']);
</script>
