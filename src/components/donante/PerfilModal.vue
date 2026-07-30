<template>
  <GenericModal :isOpen="isOpen" @close="$emit('close')" maxWidthClass="max-w-md">
    <!-- Banner Header con Margen Negativo -->
    <div class="-mx-6 -mt-6 sm:-mx-8 sm:-mt-8 h-32 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-t-[2rem] sm:rounded-t-[2.5rem] relative overflow-hidden mb-12">
      <!-- Decoración sutil de fondo -->
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px); background-size: 20px 20px;"></div>
      <div class="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/4"></div>
    </div>

    <!-- Perfil y Foto (Sobreponiéndose al banner) -->
    <div class="flex flex-col items-center -mt-24 mb-6 relative z-10">
      <div class="relative group cursor-pointer" @click="triggerFileInput">
        <div class="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity"></div>
        <img :src="perfil.previewImagen || perfil.foto" class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl relative z-10 bg-white" />
        <button class="absolute bottom-1 right-1 bg-emerald-600 hover:bg-emerald-700 p-2.5 rounded-full text-white shadow-lg transition-transform hover:scale-110 z-20">
          <CameraIcon class="w-4 h-4"/>
        </button>
        <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" class="hidden" />
      </div>
      <h3 class="text-2xl font-black text-stone-800 mt-4 tracking-tight">{{ perfil.nombre || 'Mi Perfil' }}</h3>
      <p class="text-stone-500 text-sm font-medium">{{ perfil.email }}</p>
    </div>

    <!-- Formulario -->
    <div class="space-y-5">
      <div class="bg-stone-50 p-5 rounded-2xl border border-stone-100">
        <div class="mb-4">
          <label class="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <BuildingIcon class="w-3.5 h-3.5 text-stone-400" /> Nombre / Razón Social
          </label>
          <input v-model="perfil.nombre" class="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-stone-700 font-medium shadow-sm" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <MailIcon class="w-3.5 h-3.5 text-stone-400" /> Email de Contacto
          </label>
          <input v-model="perfil.email" type="email" class="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-stone-700 font-medium shadow-sm" />
        </div>
      </div>

      <div class="pt-2 flex flex-col gap-3">
        <button @click="$emit('guardar', perfil)" class="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          <CheckIcon class="w-5 h-5" /> Guardar Cambios
        </button>
        <button @click="$emit('eliminar')" class="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-transparent hover:border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
          <TrashIcon class="w-4 h-4" /> Eliminar Mi Cuenta
        </button>
      </div>
    </div>
  </GenericModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GenericModal from '../common/GenericModal.vue';
import { CameraIcon, BuildingIcon, MailIcon, CheckIcon, TrashIcon } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  perfil: any;
}>();

const emit = defineEmits(['close', 'eliminar', 'guardar']);

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    props.perfil.nuevaImagen = file;
    props.perfil.previewImagen = URL.createObjectURL(file);
  }
};
</script>
