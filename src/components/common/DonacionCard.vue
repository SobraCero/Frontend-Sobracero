<template>
  <div 
    class="bg-white rounded-[2rem] p-4 shadow-sm border border-stone-100 transition-all hover:shadow-xl cursor-pointer group flex flex-col gap-4" 
    @click="$emit('click-card', item)"
  >
    <!-- Contenedor de Imagen -->
    <div class="relative h-56 w-full bg-[#f6f6f6] rounded-[1.5rem] overflow-hidden flex items-center justify-center p-4">
      <img v-if="tieneImagenValida" :src="imagen" class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
      <div v-else class="w-full h-full flex flex-col items-center justify-center text-emerald-600/50">
         <BoxIcon class="w-16 h-16 mb-2" />
         <span class="text-sm font-bold opacity-70">Sin imagen</span>
      </div>
      
      <!-- Badge Estado como el botón de corazón -->
      <div class="absolute top-4 left-4">
        <span v-if="estado" class="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black shadow-sm uppercase tracking-wider text-emerald-900 border border-white">
          {{ estado }}
        </span>
      </div>
    </div>
    
    <!-- Contenido -->
    <div class="px-2 flex-1 flex flex-col">
      <h3 class="font-black text-stone-900 text-xl leading-tight mb-1 group-hover:text-emerald-700 transition-colors">{{ titulo }}</h3>
      
      <div class="flex-1 flex flex-col gap-1.5 mt-2">
        <slot name="detalles-top"></slot>
      </div>
      
      <div class="flex flex-col gap-1 mt-2">
         <slot name="detalles"></slot>
      </div>
      
      <!-- Botones / Acciones -->
      <div class="mt-4 flex gap-3 w-full" v-if="$slots.acciones">
        <slot name="acciones"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BoxIcon } from 'lucide-vue-next';

const props = defineProps<{
  item?: any;
  imagen: string;
  titulo: string;
  estado?: string;
  badgeClass?: string;
}>();

defineEmits(['click-card']);

const tieneImagenValida = computed(() => {
  return props.imagen && !props.imagen.includes('via.placeholder') && !props.imagen.includes('placehold.co') && props.imagen !== '';
});
</script>
