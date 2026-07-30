<template>
  <GenericModal :isOpen="isOpen" @close="$emit('close')" maxWidthClass="max-w-lg">
    <h3 class="text-xl font-black text-slate-900 mb-1 pr-10">Ubicación de {{ usuario?.razonSocial || 'Usuario' }}</h3>
    <p class="text-sm text-stone-500 mb-4">{{ usuario?.direccion }}</p>
    <div class="w-full h-64 rounded-xl border border-stone-200 overflow-hidden relative z-0">
      <div :id="mapId" class="absolute inset-0"></div>
    </div>
  </GenericModal>
</template>

<script setup lang="ts">
import GenericModal from './GenericModal.vue';

defineProps<{
  isOpen: boolean;
  usuario: any;
  mapId: string;
}>();

defineEmits(['close']);
</script>
