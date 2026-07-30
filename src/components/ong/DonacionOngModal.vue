<template>
  <GenericModal :isOpen="isOpen" @close="$emit('close')" maxWidthClass="max-w-4xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2" v-if="donacion">
      <div class="space-y-5 flex flex-col justify-between">
        <div>
          <img v-if="donacion.imagen" :src="donacion.imagen" class="w-full h-56 object-cover rounded-2xl shadow-sm border border-stone-100 mb-5" />
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-black text-slate-900 pr-8 leading-tight">{{ donacion.tipo }}</h3>
            <span class="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-1 rounded-lg tracking-widest h-fit">Disponible</span>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Cantidad a rescatar</p>
              <p class="font-bold text-stone-700 text-lg">{{ donacion.kilos }} kg/porc.</p>
            </div>
            <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Vencimiento</p>
              <p class="font-bold text-stone-700 text-lg">{{ donacion.vencimiento }}</p>
            </div>
          </div>
          <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100 mb-2">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Lugar de Retiro</p>
            <p class="font-bold text-stone-700">{{ donacion.ubicacion }}</p>
          </div>
        </div>
        <BaseButton @click="$emit('reservar')" :disabled="reservaActiva != null" block size="lg" rounded="2xl" class="mt-auto">
          {{ reservaActiva ? 'Ya tienes una reserva activa' : 'Hacer Reserva' }}
        </BaseButton>
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
import BaseButton from '../ui/BaseButton.vue';

defineProps<{
  isOpen: boolean;
  donacion: any;
  reservaActiva: any;
  mapId: string;
}>();

defineEmits(['close', 'reservar']);
</script>
